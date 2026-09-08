import { Logger } from "ts-log";

import { AsyncAction } from "../../Func";
import TokenGrant from "../../models/TokenGrant";
import AccessTokenProvider from "./AccessTokenProvider";

/**
 * Exchanges a Medrunner refresh token for a new token grant.
 *
 * The function boundary keeps refresh behavior independently testable while
 * allowing TokenManager to retain the existing API exchange transport.
 */
export type TokenExchange = (refreshToken?: string) => Promise<TokenGrant>;

/**
 * Options for static-token and refresh-token authentication.
 */
export interface StaticRefreshTokenProviderOptions {
  accessToken?: string;
  refreshToken?: string;
  exchangeToken: TokenExchange;
  refreshCallback?: AsyncAction<TokenGrant>;
  log?: Logger;
}

/**
 * Preserves the library's legacy bearer-token and refresh-token behavior.
 *
 * A configured static token remains usable when no refresh token is available,
 * while refresh-capable configurations coalesce concurrent token exchanges.
 */
export default class StaticRefreshTokenProvider implements AccessTokenProvider {
  private accessToken?: string;
  private refreshToken?: string;
  private accessTokenExpiration?: string;
  private tokenFetchPromise?: Promise<TokenGrant>;

  public constructor(private readonly options: StaticRefreshTokenProviderOptions) {
    this.accessToken = options.accessToken;
    this.refreshToken = options.refreshToken;
  }

  public async getAccessToken(source: string = "unknown"): Promise<string | undefined> {
    this.options.log?.debug(`getAccessToken: New token requested from ${source}`);

    if (this.accessToken !== undefined && this.accessTokenExpiration !== undefined) {
      const expiration = Math.trunc(new Date(this.accessTokenExpiration).getTime() / 1000);
      const now = Math.trunc(Date.now() / 1000);

      if (expiration > now) {
        this.options.log?.debug(`getAccessToken: ${source} => Token valid and simply returned`);
        return this.accessToken;
      }
    }

    if (this.refreshToken === undefined) {
      this.options.log?.debug(`getAccessToken: ${source} => Missing refresh token, returning stored access token`);
      return this.accessToken;
    }

    if (this.tokenFetchPromise === undefined) {
      this.options.log?.debug(`getAccessToken: ${source} => No current token fetch, starting new fetch`);
      this.tokenFetchPromise = this.options.exchangeToken(this.refreshToken);
    }

    try {
      this.options.log?.debug(`getAccessToken: ${source} => Waiting for token fetch to complete`);
      const tokens = await this.tokenFetchPromise;

      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;
      this.accessTokenExpiration = tokens.accessTokenExpiration;

      if (this.options.refreshCallback !== undefined) {
        this.options.log?.debug(`getAccessToken: ${source} => Calling refresh callback with new tokens`);
        await this.options.refreshCallback(tokens);
      }
    } finally {
      this.tokenFetchPromise = undefined;
    }

    this.options.log?.debug(`getAccessToken: ${source} => Returning new access token`);
    return this.accessToken;
  }

  /**
   * Marks a refreshed bearer token stale while preserving a fixed static token.
   */
  public invalidate(): void {
    this.accessTokenExpiration = undefined;
  }
}
