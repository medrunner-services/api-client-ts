import type { Configuration } from "openid-client";

import AccessTokenProvider from "./AccessTokenProvider";

const EXPIRY_SKEW_MILLISECONDS = 60_000;

/**
 * Time source used to calculate client-credentials cache validity.
 */
export interface Clock {
  now(): number;
}

/**
 * Normalized token response returned by an OIDC client-credentials grant.
 */
export interface ClientCredentialsGrantResult {
  accessToken?: string;
  expiresIn?: number;
}

/**
 * Performs the external client-credentials grant.
 *
 * Injecting this boundary keeps the provider unit-testable without performing
 * discovery or contacting an identity provider.
 */
export interface ClientCredentialsGrantClient {
  grant(): Promise<ClientCredentialsGrantResult>;
}

/**
 * Configuration for OIDC client-credentials authentication.
 */
export interface OidcClientCredentialsTokenProviderOptions {
  issuer: URL;
  clientId: string;
  clientSecret: string;
  scopes: readonly string[];
  expirySkewSeconds?: number;
  clock?: Clock;
  grantClient?: ClientCredentialsGrantClient;
}

/**
 * Obtains service-to-service tokens through OIDC client credentials.
 *
 * This provider owns a single-flight, short-lived access-token cache and has
 * no relationship to the API client's static or refresh-token providers.
 */
export default class OidcClientCredentialsTokenProvider implements AccessTokenProvider {
  private readonly clock: Clock;
  private readonly grantClient: ClientCredentialsGrantClient;
  private readonly expirySkewMilliseconds: number;
  private cachedToken?: { accessToken: string; validUntil: number };
  private tokenGrant?: { generation: number; promise: Promise<string> };
  private invalidationGeneration = 0;

  public constructor(options: OidcClientCredentialsTokenProviderOptions) {
    validateOptions(options);
    this.clock = options.clock ?? { now: (): number => Date.now() };
    this.grantClient = options.grantClient ?? new OpenIdClientCredentialsGrantClient(options);
    this.expirySkewMilliseconds = (options.expirySkewSeconds ?? EXPIRY_SKEW_MILLISECONDS / 1_000) * 1_000;
  }

  public async getAccessToken(source: string): Promise<string> {
    void source;
    if (this.cachedToken !== undefined && this.clock.now() < this.cachedToken.validUntil) {
      return this.cachedToken.accessToken;
    }

    const generation = this.invalidationGeneration;
    let tokenGrant = this.tokenGrant;

    if (tokenGrant === undefined || tokenGrant.generation !== generation) {
      tokenGrant = {
        generation,
        promise: this.acquireToken(generation),
      };
      this.tokenGrant = tokenGrant;
    }

    try {
      return await tokenGrant.promise;
    } finally {
      if (this.tokenGrant === tokenGrant) {
        this.tokenGrant = undefined;
      }
    }
  }

  /**
   * Discards the cached token so the next request obtains fresh credentials.
   */
  public invalidate(): void {
    this.cachedToken = undefined;
    this.invalidationGeneration++;
  }

  private async acquireToken(generation: number): Promise<string> {
    const result = await this.grantClient.grant();

    if (typeof result.accessToken !== "string" || result.accessToken.length === 0) {
      throw new Error("OIDC client-credentials grant did not include an access token.");
    }

    if (typeof result.expiresIn !== "number" || !Number.isFinite(result.expiresIn) || result.expiresIn <= 0) {
      throw new Error("OIDC client-credentials grant did not include a positive expiresIn value.");
    }

    if (generation === this.invalidationGeneration) {
      this.cachedToken = {
        accessToken: result.accessToken,
        validUntil: this.clock.now() + result.expiresIn * 1_000 - this.expirySkewMilliseconds,
      };
    }

    return result.accessToken;
  }
}

/**
 * Adapts the ESM-only openid-client package behind the grant test seam.
 */
class OpenIdClientCredentialsGrantClient implements ClientCredentialsGrantClient {
  private configuration?: Promise<Configuration>;

  public constructor(private readonly options: OidcClientCredentialsTokenProviderOptions) {}

  public async grant(): Promise<ClientCredentialsGrantResult> {
    const client = await import("openid-client");
    const configurationPromise =
      this.configuration ??
      (this.configuration = client.discovery(
        this.options.issuer,
        this.options.clientId,
        this.options.clientSecret,
        client.ClientSecretBasic(this.options.clientSecret),
      ));
    let configuration: Configuration;

    try {
      configuration = await configurationPromise;
    } catch (error) {
      if (this.configuration === configurationPromise) {
        this.configuration = undefined;
      }

      throw error;
    }

    const tokens = await client.clientCredentialsGrant(configuration, {
      scope: this.options.scopes.join(" "),
    });

    return {
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
    };
  }
}

function validateOptions(options: OidcClientCredentialsTokenProviderOptions): void {
  if (!(options.issuer instanceof URL)) {
    throw new Error("OIDC issuer must be a URL.");
  }

  if (options.clientId.trim().length === 0) {
    throw new Error("OIDC clientId must not be empty.");
  }

  if (options.clientSecret.trim().length === 0) {
    throw new Error("OIDC clientSecret must not be empty.");
  }

  if (options.scopes.length === 0 || options.scopes.some(scope => scope.trim().length === 0)) {
    throw new Error("OIDC scopes must contain at least one non-empty scope.");
  }

  if (
    options.expirySkewSeconds !== undefined &&
    (!Number.isFinite(options.expirySkewSeconds) || options.expirySkewSeconds < 0)
  ) {
    throw new Error("OIDC expirySkewSeconds must be a non-negative finite number.");
  }
}
