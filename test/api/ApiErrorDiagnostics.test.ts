import axios, { AxiosHeaders } from "axios";
import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { Logger } from "ts-log";

import { ApiFailureError, normalizeApiFailure, validateApiResponse } from "../../src/api/ApiErrorDiagnostics";
import ApiEndpoint from "../../src/api/endpoints/ApiEndpoint";
import DefaultApiConfig from "../../src/api/endpoints/DefaultApiConfig";
import TokenManager from "../../src/api/endpoints/auth/TokenManager";
import { ApiContractError } from "../../src/contracts/ApiContract";

class Endpoint extends ApiEndpoint {
  public constructor(config: DefaultApiConfig, log?: Logger) { super(config, new TokenManager(config), log); }
  protected endpoint(): string { return "test"; }
  public call() { return this.getRequest("/resource"); }
}

describe("HTTP diagnostic identity", () => {
  let mock: MockAdapter;
  beforeEach(() => { mock = new MockAdapter(axios); });
  afterEach(() => { mock.restore(); });
  const makeEndpoint = () => new Endpoint(new DefaultApiConfig({ baseUrl: "https://api.test", accessToken: "token" }));

  it.each([undefined, "unavailable", "<html>failure</html>", { title: 42 }, ["bad-body"]])(
    "retains header identity without claiming incompatible body %j is a problem", async body => {
      mock.onGet("https://api.test/test/resource").reply(503, body, { "X-Request-ID": "server-id" });
      await expect(makeEndpoint().call()).resolves.toMatchObject({ success: false, statusCode: 503, requestId: "server-id", problemDetails: undefined });
    },
  );

  it("prefers the header, records mismatch, and retains typed problem/domain data", async () => {
    mock.onGet("https://api.test/test/resource").reply(409, {
      title: "Conflict", status: 409, requestId: "body-id", traceId: "trace-id", errorCode: 1002,
      data: { staffMemberId: "staff", terminationReason: "reason: intact", discordId: null, rsiHandle: null, matchingAccountIds: null },
    }, { "X-Request-ID": "header-id" });
    const result = await makeEndpoint().call();
    expect(result).toMatchObject({ requestId: "header-id", traceId: "trace-id", requestIdMismatch: true, problemDetails: { errorCode: 1002, data: { staffMemberId: "staff", terminationReason: "reason: intact" } } });
    const reason: string | null | undefined = result.problemDetails?.data?.terminationReason;
    expect(reason).toBe("reason: intact");
  });

  it("falls back to a validated body ID and rejects compound/control identifiers", async () => {
    mock.onGet("https://api.test/test/resource").replyOnce(400, { title: "Bad input", requestId: "body-id" });
    expect((await makeEndpoint().call()).requestId).toBe("body-id");
    mock.onGet("https://api.test/test/resource").replyOnce(400, { title: "Bad input", requestId: "bad\nvalue" }, { "X-Request-ID": ["one", "two"] });
    expect((await makeEndpoint().call()).requestId).toBeUndefined();
    mock.onGet("https://api.test/test/resource").replyOnce(400, {}, { "X-Request-ID": "one,two" });
    expect((await makeEndpoint().call()).requestId).toBeUndefined();
  });

  it("preserves legacy domain codes without parsing serialized errorMessage", async () => {
    mock.onGet("https://api.test/test/resource").reply(409, { errorCode: 2, message: "Dispatcher" });
    expect((await makeEndpoint().call()).problemDetails?.errorCode).toBe(2);
  });

  it("keeps network failures free of fabricated server identity", async () => {
    mock.onGet("https://api.test/test/resource").networkError();
    expect(await makeEndpoint().call()).toMatchObject({ success: false, failureKind: "transport", requestId: undefined, statusCode: undefined });
  });

  it("distinguishes expected cancellation for portal presentation", () => {
    expect(normalizeApiFailure(new axios.CanceledError())).toMatchObject({ failureKind: "cancelled", requestId: undefined });
  });

  it("logs normalized IDs and mismatch without including request secrets", async () => {
    const log = { trace: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn(), logApiRequestFailure: vi.fn() };
    const endpoint = new Endpoint(new DefaultApiConfig({ baseUrl: "https://api.test", accessToken: "request-token-secret" }), log);
    mock.onGet("https://api.test/test/resource").reply(409, { title: "Conflict", requestId: "body", traceId: "trace" }, { "X-Request-ID": "header" });
    await endpoint.call();
    expect(log.logApiRequestFailure).toHaveBeenCalledWith(expect.objectContaining({ requestId: "header", traceId: "trace", requestIdMismatch: true }));
    expect(JSON.stringify(log.logApiRequestFailure.mock.calls)).not.toContain("request-token-secret");
    expect(JSON.stringify(log.logApiRequestFailure.mock.calls)).not.toContain("Authorization");
  });

  it("uses the terminal replay identity and keeps one retry", async () => {
    const provider = { getAccessToken: vi.fn().mockResolvedValue("token"), invalidate: vi.fn() };
    const endpoint = new Endpoint(new DefaultApiConfig({ baseUrl: "https://api.test", accessTokenProvider: provider }));
    mock.onGet("https://api.test/test/resource").replyOnce(401, {}, { "X-Request-ID": "initial" }).onGet("https://api.test/test/resource").reply(403, {}, { "X-Request-ID": "terminal" });
    expect(await endpoint.call()).toMatchObject({ statusCode: 403, requestId: "terminal" });
    expect(mock.history.get).toHaveLength(2);
    expect(provider.invalidate).toHaveBeenCalledOnce();
  });

  it("preserves an initial token exchange failure without calling or replaying the endpoint", async () => {
    const endpoint = new Endpoint(new DefaultApiConfig({ baseUrl: "https://api.test", refreshToken: "refresh" }));
    mock.onPost("https://api.test/auth/exchange").reply(401, { title: "Exchange failed", requestId: "exchange-id" });
    expect(await endpoint.call()).toMatchObject({ statusCode: 401, requestId: "exchange-id", failureKind: "http" });
    expect(mock.history.post).toHaveLength(1);
    expect(mock.history.get).toHaveLength(0);
  });

  it("attributes failed recovery exchange to the exchange instead of the first 401", async () => {
    const endpoint = new Endpoint(new DefaultApiConfig({ baseUrl: "https://api.test", refreshToken: "refresh" }));
    mock.onPost("https://api.test/auth/exchange").replyOnce(200, {
      accessToken: "access", refreshToken: "refresh", accessTokenExpiration: "2099-01-01T00:00:00Z", refreshTokenExpiration: null,
    }).onPost("https://api.test/auth/exchange").reply(503, { title: "Exchange unavailable" }, { "X-Request-ID": "exchange-recovery" });
    mock.onGet("https://api.test/test/resource").reply(401, {}, { "X-Request-ID": "first" });
    expect(await endpoint.call()).toMatchObject({ statusCode: 503, requestId: "exchange-recovery" });
    expect(mock.history.post).toHaveLength(2);
    expect(mock.history.get).toHaveLength(1);
  });

  it("retains HTTP context when successful-response schema validation fails", () => {
    let failure: unknown;
    try {
      validateApiResponse("POST", "/Auth/exchange", { status: 200, statusText: "OK", data: {}, headers: AxiosHeaders.from({ "X-Request-ID": "contract-response" }), config: { headers: new AxiosHeaders() } });
    } catch (error) { failure = error; }
    expect(failure).toBeInstanceOf(ApiFailureError);
    expect(normalizeApiFailure(failure)).toMatchObject({ success: false, statusCode: 200, requestId: "contract-response", failureKind: "contract" });
    expect(normalizeApiFailure(new ApiContractError("request", "/field", "required"))).toMatchObject({ failureKind: "contract", requestId: undefined, statusCode: undefined });
  });
});
