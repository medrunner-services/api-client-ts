import { describe, expect, it, vi } from "vitest";

import StaticRefreshTokenProvider from "../../../src/api/auth/StaticRefreshTokenProvider";

describe("StaticRefreshTokenProvider", () => {
  it("returns a configured static token without an exchange", async () => {
    const exchangeToken = vi.fn();
    const provider = new StaticRefreshTokenProvider({ accessToken: "static-token", exchangeToken });

    await expect(provider.getAccessToken("test")).resolves.toBe("static-token");
    expect(exchangeToken).not.toHaveBeenCalled();
  });

  it("shares one refresh exchange between concurrent token requests", async () => {
    const exchangeToken = vi.fn().mockResolvedValue({
      accessToken: "fresh-token",
      refreshToken: "replacement-refresh-token",
      accessTokenExpiration: "2099-01-01T00:00:00.000Z",
      refreshTokenExpiration: "2099-02-01T00:00:00.000Z",
    });
    const provider = new StaticRefreshTokenProvider({
      refreshToken: "refresh-token",
      exchangeToken,
    });

    await expect(Promise.all([provider.getAccessToken("first"), provider.getAccessToken("second")])).resolves.toEqual([
      "fresh-token",
      "fresh-token",
    ]);
    expect(exchangeToken).toHaveBeenCalledTimes(1);
  });

  it("passes a refresh grant to the legacy refresh callback", async () => {
    const grant = {
      accessToken: "fresh-token",
      refreshToken: "replacement-refresh-token",
      accessTokenExpiration: "2099-01-01T00:00:00.000Z",
      refreshTokenExpiration: "2099-02-01T00:00:00.000Z",
    };
    const refreshCallback = vi.fn().mockResolvedValue(undefined);
    const provider = new StaticRefreshTokenProvider({
      refreshToken: "refresh-token",
      exchangeToken: vi.fn().mockResolvedValue(grant),
      refreshCallback,
    });

    await provider.getAccessToken("test");

    expect(refreshCallback).toHaveBeenCalledWith(grant);
  });
});
