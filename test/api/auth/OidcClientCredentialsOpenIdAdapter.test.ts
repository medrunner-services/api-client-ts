import { beforeEach, describe, expect, it, vi } from "vitest";

const oidc = vi.hoisted(() => ({
  ClientSecretBasic: vi.fn(),
  clientCredentialsGrant: vi.fn(),
  customFetch: Symbol("customFetch"),
  discovery: vi.fn(),
  allowInsecureRequests: vi.fn(),
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

  it("applies consumer-supplied OpenID Client controls to discovery and the token grant", async () => {
    const issuer = new URL("http://identity.example.test/application/o/medrunner/");
    const customFetch = vi.fn();
    const clientAuthentication = vi.fn();
    oidc.discovery.mockResolvedValue({});

    const provider = new OidcClientCredentialsTokenProvider({
      issuer,
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read"],
      openidClient: {
        allowInsecureRequests: true,
        additionalTokenParameters: { audience: "https://api.example.test" },
        clientAuthentication,
        customFetch,
        discoveryAlgorithm: "oauth2",
        timeoutSeconds: 12,
        useMtlsEndpointAliases: true,
      },
    });

    await expect(provider.getAccessToken("test")).resolves.toBe("oidc-token");

    expect(oidc.discovery).toHaveBeenCalledWith(
      issuer,
      "bot-client",
      { client_secret: "test-secret", use_mtls_endpoint_aliases: true },
      clientAuthentication,
      {
        algorithm: "oauth2",
        execute: [oidc.allowInsecureRequests],
        timeout: 12,
        [oidc.customFetch]: customFetch,
      },
    );
    expect(oidc.clientCredentialsGrant).toHaveBeenCalledWith(
      {},
      { audience: "https://api.example.test", scope: "client:read" },
    );
  });

  it("permits a custom client authentication strategy without a client secret", async () => {
    const clientAuthentication = vi.fn();
    oidc.discovery.mockImplementation(async (_issuer, _clientId, _metadata, authentication) => {
      if (authentication !== clientAuthentication) {
        throw new Error("The configured client authentication was not used.");
      }

      return {};
    });

    const provider = new OidcClientCredentialsTokenProvider({
      issuer: new URL("https://identity.example.test/application/o/medrunner/"),
      clientId: "bot-client",
      scopes: ["client:read"],
      openidClient: { clientAuthentication },
    });

    await expect(provider.getAccessToken("test")).resolves.toBe("oidc-token");
    expect(oidc.ClientSecretBasic).not.toHaveBeenCalled();
  });

  it("uses a provider-specific discovery document while retaining the configured issuer", async () => {
    const issuer = new URL("https://auth.example.test/");
    const discoveryDocumentUrl = new URL(
      "https://auth.example.test/application/o/bot-med/.well-known/openid-configuration",
    );
    oidc.discovery.mockResolvedValue({ serverMetadata: () => ({ issuer: issuer.href }) });

    const provider = new OidcClientCredentialsTokenProvider({
      issuer,
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read"],
      openidClient: { discoveryDocumentUrl },
    });

    await expect(provider.getAccessToken("test")).resolves.toBe("oidc-token");
    expect(oidc.discovery).toHaveBeenCalledWith(
      discoveryDocumentUrl,
      "bot-client",
      { client_secret: "test-secret", use_mtls_endpoint_aliases: undefined },
      expect.anything(),
      { algorithm: undefined, execute: undefined, timeout: undefined },
    );
  });

  it("rejects a direct discovery document that advertises a different issuer", async () => {
    oidc.discovery.mockResolvedValue({ serverMetadata: () => ({ issuer: "https://untrusted.example.test/" }) });
    const provider = new OidcClientCredentialsTokenProvider({
      issuer: new URL("https://auth.example.test/"),
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read"],
      openidClient: {
        discoveryDocumentUrl: new URL(
          "https://auth.example.test/application/o/bot-med/.well-known/openid-configuration",
        ),
      },
    });

    await expect(provider.getAccessToken("test")).rejects.toThrow("issuer");
    expect(oidc.clientCredentialsGrant).not.toHaveBeenCalled();
  });
});
