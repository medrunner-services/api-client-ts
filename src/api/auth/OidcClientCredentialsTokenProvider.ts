import type { ClientAuth, Configuration, CustomFetch, DiscoveryRequestOptions } from "openid-client";

import AccessTokenProvider from "./AccessTokenProvider";

const EXPIRY_SKEW_MILLISECONDS = 60_000;
const PROTOCOL_CONTROLLED_TOKEN_PARAMETER_NAMES = new Set([
  "scope",
  "grant_type",
  "client_id",
  "client_secret",
  "client_assertion",
  "client_assertion_type",
]);

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
 * Interoperability controls applied to openid-client discovery and token grants.
 *
 * The exposed settings are limited to controls used by the client-credentials
 * flow so consumers cannot configure unrelated interactive authorization flows.
 */
export interface OidcClientCredentialsOpenIdClientOptions {
  /**
   * Allows HTTP discovery and token requests.
   *
   * This is intended only for local development or testing against a non-TLS
   * identity provider and defaults to false.
   */
  allowInsecureRequests?: boolean;

  /**
   * Additional parameters sent with the client-credentials token request.
   *
   * The provider reserves scope, grant type, and client-authentication
   * parameters to preserve its authentication contract.
   */
  additionalTokenParameters?: Readonly<Record<string, string>>;

  /**
   * Overrides the token endpoint authentication strategy.
   *
   * When omitted, the provider preserves its client_secret_basic default.
   */
  clientAuthentication?: ClientAuth;

  /**
   * Fetch implementation used for both discovery and token requests.
   */
  customFetch?: CustomFetch;

  /**
   * Explicit URL of the authorization server's discovery document.
   *
   * This supports providers such as Authentik in global issuer mode, where the
   * issuer URL does not derive the provider-specific discovery document URL.
   * The provider verifies the discovered issuer against {@link issuer} before
   * it requests a token.
   */
  discoveryDocumentUrl?: URL;

  /**
   * Selects the authorization-server metadata discovery convention.
   */
  discoveryAlgorithm?: "oidc" | "oauth2";

  /**
   * Maximum duration, in seconds, for discovery and token requests.
   */
  timeoutSeconds?: number;

  /**
   * Uses mutual-TLS endpoint aliases published by the authorization server.
   *
   * A custom Fetch implementation must provide the client certificate when the
   * selected endpoint requires mutual TLS.
   */
  useMtlsEndpointAliases?: boolean;
}

/**
 * Configuration for OIDC client-credentials authentication.
 */
export interface OidcClientCredentialsTokenProviderOptions {
  issuer: URL;
  clientId: string;
  clientSecret?: string;
  scopes: readonly string[];
  openidClient?: OidcClientCredentialsOpenIdClientOptions;
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
    const openidClientOptions = this.options.openidClient;
    const clientSecret = this.options.clientSecret;
    const discoveryDocumentUrl = openidClientOptions?.discoveryDocumentUrl;
    let configurationPromise = this.configuration;

    if (configurationPromise === undefined) {
      const discoveredConfiguration = client.discovery(
        discoveryDocumentUrl ?? this.options.issuer,
        this.options.clientId,
        {
          client_secret: clientSecret,
          use_mtls_endpoint_aliases: openidClientOptions?.useMtlsEndpointAliases,
        },
        openidClientOptions?.clientAuthentication ??
          (clientSecret === undefined ? undefined : client.ClientSecretBasic(clientSecret)),
        discoveryOptions(client, openidClientOptions),
      );
      configurationPromise =
        discoveryDocumentUrl === undefined
          ? discoveredConfiguration
          : discoveredConfiguration.then(configuration => validateDiscoveredIssuer(configuration, this.options.issuer));
      this.configuration = configurationPromise;
    }
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
      ...openidClientOptions?.additionalTokenParameters,
      scope: this.options.scopes.join(" "),
    });

    return {
      accessToken: tokens.access_token,
      expiresIn: tokens.expires_in,
    };
  }
}

function validateDiscoveredIssuer(configuration: Configuration, expectedIssuer: URL): Configuration {
  if (configuration.serverMetadata().issuer !== expectedIssuer.href) {
    throw new Error("OIDC discovery document issuer must match the configured issuer.");
  }

  return configuration;
}

function discoveryOptions(
  client: typeof import("openid-client"),
  options: OidcClientCredentialsOpenIdClientOptions | undefined,
): DiscoveryRequestOptions {
  const result: DiscoveryRequestOptions = {
    algorithm: options?.discoveryAlgorithm,
    execute: options?.allowInsecureRequests === true ? [client.allowInsecureRequests] : undefined,
    timeout: options?.timeoutSeconds,
  };

  if (options?.customFetch !== undefined) {
    result[client.customFetch] = options.customFetch;
  }

  return result;
}

function validateOptions(options: OidcClientCredentialsTokenProviderOptions): void {
  if (!(options.issuer instanceof URL)) {
    throw new Error("OIDC issuer must be a URL.");
  }

  if (options.clientId.trim().length === 0) {
    throw new Error("OIDC clientId must not be empty.");
  }

  if (options.clientSecret !== undefined && options.clientSecret.trim().length === 0) {
    throw new Error("OIDC clientSecret must not be empty.");
  }

  if (options.clientSecret === undefined && options.openidClient?.clientAuthentication === undefined) {
    throw new Error("OIDC clientSecret is required unless an OpenID client authentication strategy is configured.");
  }

  const discoveryDocumentUrl = options.openidClient?.discoveryDocumentUrl;
  if (discoveryDocumentUrl !== undefined && !(discoveryDocumentUrl instanceof URL)) {
    throw new Error("OIDC OpenID client discoveryDocumentUrl must be a URL.");
  }

  if (discoveryDocumentUrl !== undefined && options.openidClient?.discoveryAlgorithm !== undefined) {
    throw new Error("OIDC OpenID client discoveryAlgorithm cannot be combined with discoveryDocumentUrl.");
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

  if (
    options.openidClient?.timeoutSeconds !== undefined &&
    (!Number.isFinite(options.openidClient.timeoutSeconds) || options.openidClient.timeoutSeconds <= 0)
  ) {
    throw new Error("OIDC OpenID client timeoutSeconds must be a positive finite number.");
  }

  for (const [name, value] of Object.entries(options.openidClient?.additionalTokenParameters ?? {})) {
    if (name.trim().length === 0) {
      throw new Error("OIDC additional token parameter name must not be empty.");
    }

    if (value.trim().length === 0) {
      throw new Error(`OIDC additional token parameter "${name}" value must not be empty.`);
    }

    if (PROTOCOL_CONTROLLED_TOKEN_PARAMETER_NAMES.has(name)) {
      throw new Error(`OIDC additional token parameter "${name}" is controlled by the provider.`);
    }
  }
}
