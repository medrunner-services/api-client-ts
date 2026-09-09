import { describe, expect, it, vi } from "vitest";

import type ApiConfig from "../../src/api/ApiConfig";
import DefaultApiConfig from "../../src/api/endpoints/DefaultApiConfig";

describe("DefaultApiConfig authentication selection", () => {
  const provider = {
    getAccessToken: vi.fn(),
    invalidate: vi.fn(),
  };

  it("preserves a caller-supplied access token provider", () => {
    const config = new DefaultApiConfig({ accessTokenProvider: provider } as ApiConfig) as DefaultApiConfig & {
      accessTokenProvider?: typeof provider;
    };

    expect(config.accessTokenProvider).toBe(provider);
  });

  it.each([{ accessToken: "access-token" }, { refreshToken: "refresh-token" }, { cookieAuth: true }])(
    "rejects an access token provider combined with legacy authentication %o",
    legacyAuthentication => {
      expect(
        () => new DefaultApiConfig({ accessTokenProvider: provider, ...legacyAuthentication } as ApiConfig),
      ).toThrow();
    },
  );
});
