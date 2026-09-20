import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { metrics, SpanKind, SpanStatusCode, trace } from "@opentelemetry/api";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type ApiConfig from "../../../src/api/ApiConfig";
import ApiEndpoint from "../../../src/api/endpoints/ApiEndpoint";
import DefaultApiConfig from "../../../src/api/endpoints/DefaultApiConfig";
import TokenManager from "../../../src/api/endpoints/auth/TokenManager";

class TestEndpoint extends ApiEndpoint {
  protected override endpoint(): string {
    return "test";
  }

  public async getAuthenticated(): ReturnType<ApiEndpoint["getRequest"]> {
    return await this.getRequest("/resource");
  }

  public async getPublic(): ReturnType<ApiEndpoint["getRequest"]> {
    return await this.getRequest("/public", undefined, true);
  }

  public async create(data: { name: string }): ReturnType<ApiEndpoint["postRequest"]> {
    return await this.postRequest("/resource", data);
  }
}

describe("ApiEndpoint authenticated recovery", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(axios);
  });

  afterEach(() => {
    mock.restore();
    trace.disable();
    metrics.disable();
  });

  it("invalidates, reacquires, and replays an authenticated request once after a 401", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValueOnce("expired-token").mockResolvedValueOnce("fresh-token"),
      invalidate: vi.fn(),
    };
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/resource";

    mock.onGet(url).replyOnce(401).onGet(url).replyOnce(200, { id: "1" });

    await expect(endpoint.getAuthenticated()).resolves.toEqual({ success: true, data: { id: "1" } });
    expect(provider.invalidate).toHaveBeenCalledOnce();
    expect(provider.getAccessToken).toHaveBeenCalledTimes(2);
    expect(mock.history.get).toHaveLength(2);
  });

  it("returns a second 401 without a third request", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("expired-token"),
      invalidate: vi.fn(),
    };
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/resource";

    mock.onGet(url).reply(401);

    await expect(endpoint.getAuthenticated()).resolves.toMatchObject({ success: false, statusCode: 401 });
    expect(provider.invalidate).toHaveBeenCalledOnce();
    expect(mock.history.get).toHaveLength(2);
  });

  it("replays a mutation with its body and caller-supplied headers", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValueOnce("expired-token").mockResolvedValueOnce("fresh-token"),
      invalidate: vi.fn(),
    };
    const endpoint = createEndpoint(provider, async () => ({ "X-Correlation-Id": "trace-123" }));
    const url = "https://api.test/test/resource";

    mock.onPost(url, { name: "Ada" }).replyOnce(401).onPost(url, { name: "Ada" }).replyOnce(200, { id: "1" });

    await expect(endpoint.create({ name: "Ada" })).resolves.toEqual({ success: true, data: { id: "1" } });
    expect(mock.history.post.map(request => request.headers?.Authorization)).toEqual([
      "Bearer expired-token",
      "Bearer fresh-token",
    ]);
    expect(mock.history.post.map(request => request.headers?.["X-Correlation-Id"])).toEqual(["trace-123", "trace-123"]);
  });

  it("does not invalidate or replay an explicitly unauthenticated 401", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/public";

    mock.onGet(url).reply(401);

    await expect(endpoint.getPublic()).resolves.toMatchObject({ success: false, statusCode: 401 });
    expect(provider.invalidate).not.toHaveBeenCalled();
    expect(mock.history.get).toHaveLength(1);
  });

  it("exposes a Problem Details body returned from API errors", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/public";

    mock.onGet(url).reply(400, {
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "One or more validation errors occurred.",
      status: 400,
      detail: "The supplied resource is invalid.",
      instance: "/test/public",
    });

    await expect(endpoint.getPublic()).resolves.toMatchObject({
      success: false,
      statusCode: 400,
      problemDetails: {
        type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
        title: "One or more validation errors occurred.",
        status: 400,
        detail: "The supplied resource is invalid.",
        instance: "/test/public",
      },
    });
  });

  it("logs a failed request's status and complete Problem Details body", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new RecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const problemDetails = {
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "One or more validation errors occurred.",
      status: 400,
      detail: "The supplied resource is invalid.",
      instance: "/test/public",
    };

    mock.onGet(url).reply(400, problemDetails);

    await expect(endpoint.getPublic()).resolves.toMatchObject({
      success: false,
      statusCode: 400,
      errorMessage: JSON.stringify(problemDetails),
    });
    expect(log.warnings).toEqual([
      `API request failed: GET ${url}; status=400; response=${JSON.stringify(problemDetails)}`,
    ]);
  });

  it("exports Problem Details through a typed structured failure logger", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new StructuredRecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const problemDetails = {
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "One or more validation errors occurred.",
      status: 400,
      detail: "The supplied resource is invalid.",
      instance: "/test/public",
    };

    mock.onGet(url).reply(400, problemDetails);

    await expect(endpoint.getPublic()).resolves.toMatchObject({ success: false, statusCode: 400 });
    expect(log.failures).toEqual([
      {
        endpoint: "TestEndpoint",
        method: "GET",
        serverAddress: "api.test",
        path: "/test/public",
        statusCode: 400,
        retryCount: 0,
        errorType: problemDetails.type,
        responseBody: JSON.stringify(problemDetails),
        responseBodyTruncated: false,
        problemDetails,
      },
    ]);
    expect(log.warnings).toEqual([]);
  });

  it("bounds a structured response body while preserving the full API response contract", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new StructuredRecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const responseBody = "x".repeat(16 * 1024 + 1);

    mock.onGet(url).reply(500, responseBody);

    await expect(endpoint.getPublic()).resolves.toMatchObject({
      success: false,
      statusCode: 500,
      errorMessage: responseBody,
    });
    expect(log.failures).toEqual([
      expect.objectContaining({
        errorType: "http.response",
        responseBody: "x".repeat(16 * 1024),
        responseBodyTruncated: true,
      }),
    ]);
    expect(log.errors).toEqual([]);
  });

  it("bounds a structured response body by UTF-8 bytes without splitting a character", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new StructuredRecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const responseBody = "€".repeat(6_000);

    mock.onGet(url).reply(500, responseBody);

    await endpoint.getPublic();

    expect(log.failures).toEqual([
      expect.objectContaining({
        responseBody: "€".repeat(Math.floor((16 * 1024) / 3)),
        responseBodyTruncated: true,
      }),
    ]);
  });

  it("bounds plaintext fallback logging without changing the API response body", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new RecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const responseBody = "x".repeat(16 * 1024 + 1);

    mock.onGet(url).reply(500, responseBody);

    await expect(endpoint.getPublic()).resolves.toMatchObject({ errorMessage: responseBody });
    expect(log.errors).toEqual([
      `API request failed: GET ${url}; status=500; response=${"x".repeat(16 * 1024)} [truncated]`,
    ]);
  });

  it("logs server failures at error severity", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const log = new RecordingLogger();
    const endpoint = createEndpoint(provider, undefined, log);
    const url = "https://api.test/test/public";
    const errorBody = { title: "Unexpected failure", status: 500, detail: "The database is unavailable." };

    mock.onGet(url).reply(500, errorBody);

    await expect(endpoint.getPublic()).resolves.toMatchObject({ success: false, statusCode: 500 });
    expect(log.warnings).toEqual([]);
    expect(log.errors).toEqual([`API request failed: GET ${url}; status=500; response=${JSON.stringify(errorBody)}`]);
  });

  it("emits a sanitized terminal failure span and metrics", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("unused-token"),
      invalidate: vi.fn(),
    };
    const telemetry = new TelemetryRecorder();
    telemetry.enable();
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/public";
    const problemDetails = {
      type: "https://www.rfc-editor.org/rfc/rfc9110#name-400-bad-request",
      title: "One or more validation errors occurred.",
      status: 400,
      detail: "The supplied resource is invalid.",
      instance: "/test/public",
    };

    mock.onGet(url).reply(400, problemDetails);

    await expect(endpoint.getPublic()).resolves.toMatchObject({ success: false, statusCode: 400 });

    expect(telemetry.spans).toEqual([
      expect.objectContaining({
        name: "medrunner.api.request",
        options: expect.objectContaining({
          kind: SpanKind.INTERNAL,
          attributes: {
            "medrunner.api.endpoint": "TestEndpoint",
            "http.request.method": "GET",
            "server.address": "api.test",
          },
        }),
        attributes: expect.objectContaining({
          "http.response.status_code": 400,
          "error.type": "http.response",
          "medrunner.api.retry_count": 0,
        }),
        status: { code: SpanStatusCode.ERROR },
        events: [
          {
            name: "exception",
            attributes: {
              "exception.type": "http.response",
            },
          },
        ],
      }),
    ]);
    expect(telemetry.spans[0].attributes).not.toHaveProperty("url.path");
    expect(telemetry.spans[0].attributes).not.toHaveProperty("medrunner.api.response.body");
    expect(telemetry.measurements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: "medrunner.api.client.request.duration",
          attributes: expect.objectContaining({
            "http.response.status_code": 400,
            "error.type": "http.response",
          }),
        }),
        expect.objectContaining({
          name: "medrunner.api.client.request.failures",
          value: 1,
          attributes: expect.objectContaining({
            "http.response.status_code": 400,
            "error.type": "http.response",
          }),
        }),
      ]),
    );
  });

  it("records one retry and one successful logical request", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValueOnce("expired-token").mockResolvedValueOnce("fresh-token"),
      invalidate: vi.fn(),
    };
    const telemetry = new TelemetryRecorder();
    telemetry.enable();
    const endpoint = createEndpoint(provider);
    const url = "https://api.test/test/resource";

    mock.onGet(url).replyOnce(401).onGet(url).replyOnce(200, { id: "1" });

    await expect(endpoint.getAuthenticated()).resolves.toEqual({ success: true, data: { id: "1" } });

    expect(telemetry.spans).toHaveLength(1);
    expect(telemetry.spans[0].attributes).toMatchObject({
      "http.response.status_code": 200,
      "medrunner.api.retry_count": 1,
    });
    expect(telemetry.measurements).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: "medrunner.api.client.request.duration" }),
        expect.objectContaining({
          name: "medrunner.api.client.request.retries",
          value: 1,
          attributes: {
            "medrunner.api.endpoint": "TestEndpoint",
            "http.request.method": "GET",
            "server.address": "api.test",
          },
        }),
      ]),
    );
    expect(telemetry.measurements).not.toEqual(
      expect.arrayContaining([expect.objectContaining({ name: "medrunner.api.client.request.failures" })]),
    );
  });
});

function createEndpoint(
  provider: { getAccessToken: ReturnType<typeof vi.fn>; invalidate: ReturnType<typeof vi.fn> },
  headerProvider?: () => Promise<{ [key: string]: string }>,
  log?: RecordingLogger,
): TestEndpoint {
  const config = new DefaultApiConfig({
    baseUrl: "https://api.test",
    accessTokenProvider: provider,
  } as ApiConfig);
  const tokenManager = new TokenManager(config);

  return new TestEndpoint(config, tokenManager, log, headerProvider);
}

/** Captures the logger boundary as an observable side effect without relying on a mock implementation. */
class RecordingLogger {
  public readonly warnings: string[] = [];
  public readonly errors: string[] = [];

  public trace(): void {}

  public debug(): void {}

  public info(): void {}

  public warn(message?: unknown): void {
    this.warnings.push(String(message));
  }

  public error(message?: unknown): void {
    this.errors.push(String(message));
  }
}

/** Captures the optional structured failure capability exposed by the API client. */
class StructuredRecordingLogger extends RecordingLogger {
  public readonly failures: unknown[] = [];

  public logApiRequestFailure(failure: unknown): void {
    this.failures.push(failure);
  }
}

/** Records interactions with the OpenTelemetry API without bringing an SDK into the library test suite. */
class TelemetryRecorder {
  public readonly measurements: Array<{ name: string; value: number; attributes?: Record<string, unknown> }> = [];
  public readonly spans: Array<{
    name: string;
    options: Record<string, unknown>;
    attributes: Record<string, unknown>;
    events: Array<{ name: string; attributes?: Record<string, unknown> }>;
    status?: { code: SpanStatusCode };
    ended: boolean;
  }> = [];

  public enable(): void {
    trace.disable();
    metrics.disable();
    trace.setGlobalTracerProvider({
      getTracer: () => ({
        startSpan: (name: string, options: Record<string, unknown> = {}) => {
          const record = { name, options, attributes: {}, events: [], ended: false };
          this.spans.push(record);
          const span = {
            setAttribute: (key: string, value: unknown) => {
              record.attributes[key] = value;
              return span;
            },
            setAttributes: (attributes: Record<string, unknown>) => {
              Object.assign(record.attributes, attributes);
              return span;
            },
            addEvent: (eventName: string, attributes?: Record<string, unknown>) => {
              record.events.push({ name: eventName, attributes });
              return span;
            },
            setStatus: (status: { code: SpanStatusCode }) => {
              record.status = status;
              return span;
            },
            end: () => {
              record.ended = true;
            },
          };
          return span;
        },
      }),
    } as never);
    metrics.setGlobalMeterProvider({
      getMeter: () => ({
        createHistogram: (name: string) => ({
          record: (value: number, attributes?: Record<string, unknown>) => {
            this.measurements.push({ name, value, attributes });
          },
        }),
        createCounter: (name: string) => ({
          add: (value: number, attributes?: Record<string, unknown>) => {
            this.measurements.push({ name, value, attributes });
          },
        }),
      }),
    } as never);
  }
}
