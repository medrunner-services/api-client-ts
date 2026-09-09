import { beforeEach, describe, expect, it, vi } from "vitest";

const oidc = vi.hoisted(() => ({
  ClientSecretBasic: vi.fn(),
  clientCredentialsGrant: vi.fn(),
  discovery: vi.fn(),
}));

vi.mock("openid-client", () => oidc);

import OidcClientCredentialsTokenProvider from "../../../src/api/auth/OidcClientCredentialsTokenProvider";

describe("openid-client adapter", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    oidc.ClientSecretBasic.mockReturnValue({});
    oidc.clientCredentialsGrant.mockResolvedValue({ access_token: "oidc-token", expires_in: 120 });
  });

  it("retries discovery after a transient discovery failure", async () => {
    oidc.discovery.mockRejectedValueOnce(new Error("discovery failed")).mockResolvedValueOnce({});
    const provider = new OidcClientCredentialsTokenProvider({
      issuer: new URL("https://identity.example.test/application/o/medrunner/"),
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read"],
    });

    await expect(provider.getAccessToken("first")).rejects.toThrow("discovery failed");
    await expect(provider.getAccessToken("second")).resolves.toBe("oidc-token");

    expect(oidc.discovery).toHaveBeenCalledTimes(2);
  });
});
