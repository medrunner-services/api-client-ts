import { describe, expect, it, vi } from "vitest";

import CookieAuthTokenProvider from "../../../src/api/auth/CookieAuthTokenProvider";

describe("CookieAuthTokenProvider", () => {
  it("renews an expired cookie session without returning a bearer token", async () => {
    const exchangeToken = vi.fn().mockResolvedValue({
      accessToken: "cookie-session-token",
      refreshToken: "server-cookie-refresh-token",
      accessTokenExpiration: "2099-01-01T00:00:00.000Z",
      refreshTokenExpiration: "2099-02-01T00:00:00.000Z",
    });
    const expiryStore = {
      getAccessTokenExpiration: vi.fn().mockReturnValue("2000-01-01T00:00:00.000Z"),
      getRefreshTokenExpiration: vi.fn().mockReturnValue(undefined),
      setAccessTokenExpiration: vi.fn(),
      setRefreshTokenExpiration: vi.fn(),
      clear: vi.fn(),
    };
    const provider = new CookieAuthTokenProvider({ exchangeToken, expiryStore });

    await expect(provider.getAccessToken("test")).resolves.toBeUndefined();
    expect(exchangeToken).toHaveBeenCalledWith(undefined);
    expect(expiryStore.setAccessTokenExpiration).toHaveBeenCalledWith("2099-01-01T00:00:00.000Z");
    expect(expiryStore.setRefreshTokenExpiration).toHaveBeenCalledWith("2099-02-01T00:00:00.000Z");
  });

  it("clears expiry metadata when invalidated", () => {
    const expiryStore = {
      getAccessTokenExpiration: vi.fn(),
      getRefreshTokenExpiration: vi.fn(),
      setAccessTokenExpiration: vi.fn(),
      setRefreshTokenExpiration: vi.fn(),
      clear: vi.fn(),
    };
    const provider = new CookieAuthTokenProvider({ exchangeToken: vi.fn(), expiryStore });

    provider.invalidate();

    expect(expiryStore.clear).toHaveBeenCalledOnce();
  });
});
