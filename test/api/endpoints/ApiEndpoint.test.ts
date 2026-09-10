import axios from "axios";
import MockAdapter from "axios-mock-adapter";
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
});

function createEndpoint(
  provider: { getAccessToken: ReturnType<typeof vi.fn>; invalidate: ReturnType<typeof vi.fn> },
  headerProvider?: () => Promise<{ [key: string]: string }>,
): TestEndpoint {
  const config = new DefaultApiConfig({
    baseUrl: "https://api.test",
    accessTokenProvider: provider,
  } as ApiConfig);
  const tokenManager = new TokenManager(config);

  return new TestEndpoint(config, tokenManager, undefined, headerProvider);
}
