import { describe, expect, it, vi } from "vitest";

import type ApiConfig from "../../../../src/api/ApiConfig";
import CookieAuthTokenProvider from "../../../../src/api/auth/CookieAuthTokenProvider";
import StaticRefreshTokenProvider from "../../../../src/api/auth/StaticRefreshTokenProvider";
import ApiEndpoint from "../../../../src/api/endpoints/ApiEndpoint";
import DefaultApiConfig from "../../../../src/api/endpoints/DefaultApiConfig";
import TokenManager from "../../../../src/api/endpoints/auth/TokenManager";

describe("TokenManager", () => {
  it("uses the caller-supplied access token provider", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("provider-token"),
      invalidate: vi.fn(),
    };
    const manager = new TokenManager(new DefaultApiConfig({ accessTokenProvider: provider } as ApiConfig));

    await expect(manager.getAccessToken("test")).resolves.toBe("provider-token");
  });

  it("selects the cookie provider for cookie authentication", () => {
    const manager = new TokenManager(new DefaultApiConfig({ cookieAuth: true }));

    expect(manager.provider).toBeInstanceOf(CookieAuthTokenProvider);
  });

  it("selects the static and refresh provider without custom or cookie authentication", () => {
    const manager = new TokenManager(new DefaultApiConfig({ accessToken: "legacy-token" }));

    expect(manager.provider).toBeInstanceOf(StaticRefreshTokenProvider);
  });

  it("retains the ApiEndpoint compatibility base type", () => {
    const manager = new TokenManager(new DefaultApiConfig({ accessToken: "legacy-token" }));

    expect(manager).toBeInstanceOf(ApiEndpoint);
  });
});
