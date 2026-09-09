import { describe, expect, it, vi } from "vitest";

import OidcClientCredentialsTokenProvider from "../../../src/api/auth/OidcClientCredentialsTokenProvider";

describe("OidcClientCredentialsTokenProvider", () => {
  const createProvider = (grant = vi.fn().mockResolvedValue({ accessToken: "oidc-token", expiresIn: 120 })) => {
    let now = 0;
    const provider = new OidcClientCredentialsTokenProvider({
      issuer: new URL("https://identity.example.test/application/o/medrunner/"),
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read", "staff:read"],
      clock: { now: () => now },
      grantClient: { grant },
    });

    return {
      grant,
      provider,
      setNow(value: number) {
        now = value;
      },
    };
  };

  it("caches a token until the expiry-skew boundary", async () => {
    const { grant, provider, setNow } = createProvider();

    await expect(provider.getAccessToken("first")).resolves.toBe("oidc-token");
    setNow(59_000);
    await expect(provider.getAccessToken("cached")).resolves.toBe("oidc-token");
    setNow(60_000);
    await expect(provider.getAccessToken("renewed")).resolves.toBe("oidc-token");

    expect(grant).toHaveBeenCalledTimes(2);
  });

  it("uses a caller-supplied expiry skew", async () => {
    const grant = vi.fn().mockResolvedValue({ accessToken: "oidc-token", expiresIn: 120 });
    let now = 0;
    const provider = new OidcClientCredentialsTokenProvider({
      issuer: new URL("https://identity.example.test/application/o/medrunner/"),
      clientId: "bot-client",
      clientSecret: "test-secret",
      scopes: ["client:read"],
      expirySkewSeconds: 10,
      clock: { now: () => now },
      grantClient: { grant },
    });

    await provider.getAccessToken("first");
    now = 109_000;
    await provider.getAccessToken("cached");
    expect(grant).toHaveBeenCalledTimes(1);
    now = 110_000;
    await provider.getAccessToken("renewed");

    expect(grant).toHaveBeenCalledTimes(2);
  });

  it("shares one client-credentials grant between concurrent callers", async () => {
    const { grant, provider } = createProvider();

    await expect(Promise.all([provider.getAccessToken("first"), provider.getAccessToken("second")])).resolves.toEqual([
      "oidc-token",
      "oidc-token",
    ]);
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("acquires a replacement token after invalidation", async () => {
    const { grant, provider } = createProvider();

    await provider.getAccessToken("first");
    provider.invalidate();
    await provider.getAccessToken("second");

    expect(grant).toHaveBeenCalledTimes(2);
  });

  it("does not reuse a grant that started before invalidation", async () => {
    let resolveFirstGrant: ((value: { accessToken: string; expiresIn: number }) => void) | undefined;
    const firstGrant = new Promise<{ accessToken: string; expiresIn: number }>(resolve => {
      resolveFirstGrant = resolve;
    });
    const grant = vi
      .fn()
      .mockReturnValueOnce(firstGrant)
      .mockResolvedValueOnce({ accessToken: "replacement-token", expiresIn: 120 });
    const { provider } = createProvider(grant);

    const firstRequest = provider.getAccessToken("first");
    provider.invalidate();
    const replacementRequest = provider.getAccessToken("replacement");

    expect(grant).toHaveBeenCalledTimes(2);
    resolveFirstGrant?.({ accessToken: "invalidated-token", expiresIn: 120 });
    await expect(replacementRequest).resolves.toBe("replacement-token");
    await expect(firstRequest).resolves.toBe("invalidated-token");
  });

  it("surfaces a client-credentials failure without a fallback token", async () => {
    const { grant, provider } = createProvider(vi.fn().mockRejectedValue(new Error("token grant failed")));

    await expect(provider.getAccessToken("test")).rejects.toThrow("token grant failed");
    expect(grant).toHaveBeenCalledTimes(1);
  });

  it("permits another acquisition after a failed grant", async () => {
    const grant = vi
      .fn()
      .mockRejectedValueOnce(new Error("token grant failed"))
      .mockResolvedValueOnce({ accessToken: "recovered-token", expiresIn: 120 });
    const { provider } = createProvider(grant);

    await expect(provider.getAccessToken("failed")).rejects.toThrow("token grant failed");
    await expect(provider.getAccessToken("recovered")).resolves.toBe("recovered-token");

    expect(grant).toHaveBeenCalledTimes(2);
  });

  it("rejects a token response without a positive expiry", async () => {
    const { provider } = createProvider(vi.fn().mockResolvedValue({ accessToken: "oidc-token", expiresIn: 0 }));

    await expect(provider.getAccessToken("test")).rejects.toThrow("expiresIn");
  });

  it("rejects a non-URL issuer before any token request", () => {
    expect(
      () =>
        new OidcClientCredentialsTokenProvider({
          issuer: "https://identity.example.test/application/o/medrunner/" as unknown as URL,
          clientId: "bot-client",
          clientSecret: "test-secret",
          scopes: ["client:read"],
          grantClient: { grant: vi.fn() },
        }),
    ).toThrow("issuer");
  });

  it("rejects a non-positive OpenID Client timeout before any token request", () => {
    expect(
      () =>
        new OidcClientCredentialsTokenProvider({
          issuer: new URL("https://identity.example.test/application/o/medrunner/"),
          clientId: "bot-client",
          clientSecret: "test-secret",
          scopes: ["client:read"],
          openidClient: { timeoutSeconds: 0 },
          grantClient: { grant: vi.fn() },
        }),
    ).toThrow("timeoutSeconds");
  });

  it.each(["scope", "grant_type", "client_id", "client_secret", "client_assertion", "client_assertion_type"])(
    "rejects an additional token parameter that controls %s",
    parameter => {
      expect(
        () =>
          new OidcClientCredentialsTokenProvider({
            issuer: new URL("https://identity.example.test/application/o/medrunner/"),
            clientId: "bot-client",
            clientSecret: "test-secret",
            scopes: ["client:read"],
            openidClient: { additionalTokenParameters: { [parameter]: "untrusted-value" } },
            grantClient: { grant: vi.fn() },
          }),
      ).toThrow(parameter);
    },
  );

  it.each([
    { additionalTokenParameters: { "": "value" }, message: "name" },
    { additionalTokenParameters: { audience: "" }, message: "value" },
  ])("rejects an additional token parameter with an invalid $message", ({ additionalTokenParameters, message }) => {
    expect(
      () =>
        new OidcClientCredentialsTokenProvider({
          issuer: new URL("https://identity.example.test/application/o/medrunner/"),
          clientId: "bot-client",
          clientSecret: "test-secret",
          scopes: ["client:read"],
          openidClient: { additionalTokenParameters },
          grantClient: { grant: vi.fn() },
        }),
    ).toThrow(message);
  });
});
