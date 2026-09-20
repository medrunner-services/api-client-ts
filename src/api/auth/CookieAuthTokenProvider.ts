import { Logger } from "ts-log";

import { AsyncAction } from "../../Func";
import TokenGrant from "../../models/TokenGrant";
import AccessTokenProvider from "./AccessTokenProvider";
import { TokenExchange } from "./StaticRefreshTokenProvider";

/**
 * Stores cookie-session expiry metadata outside the token provider.
 *
 * Cookie authentication itself remains browser-managed; this store only decides
 * when the client should renew that session through `/auth/exchange`.
 */
export interface CookieTokenExpiryStore {
  getAccessTokenExpiration(): string | undefined;
  getRefreshTokenExpiration(): string | undefined;
  setAccessTokenExpiration(expiration: string): void;
  setRefreshTokenExpiration(expiration: string): void;
  clear(): void;
}

/**
 * Adapts the legacy browser storage keys to CookieTokenExpiryStore.
 */
class BrowserCookieTokenExpiryStore implements CookieTokenExpiryStore {
  public getAccessTokenExpiration(): string | undefined {
    return localStorage.getItem("accessTokenExpiration") ?? undefined;
  }

  public getRefreshTokenExpiration(): string | undefined {
    return localStorage.getItem("refreshTokenExpiration") ?? undefined;
  }

  public setAccessTokenExpiration(expiration: string): void {
    localStorage.setItem("accessTokenExpiration", expiration);
  }

  public setRefreshTokenExpiration(expiration: string): void {
    localStorage.setItem("refreshTokenExpiration", expiration);
  }

  public clear(): void {
    localStorage.removeItem("accessTokenExpiration");
    localStorage.removeItem("refreshTokenExpiration");
  }
}

/**
 * Options for cookie-session renewal.
 */
export interface CookieAuthTokenProviderOptions {
  exchangeToken: TokenExchange;
  expiryStore?: CookieTokenExpiryStore;
  refreshCallback?: AsyncAction<TokenGrant>;
  log?: Logger;
}

/**
 * Renews browser cookie sessions without supplying a bearer header.
 */
export default class CookieAuthTokenProvider implements AccessTokenProvider {
  private readonly expiryStore: CookieTokenExpiryStore;
  private tokenFetchPromise?: Promise<TokenGrant>;

  public constructor(private readonly options: CookieAuthTokenProviderOptions) {
    this.expiryStore = options.expiryStore ?? new BrowserCookieTokenExpiryStore();
  }

  public async getAccessToken(source: string = "unknown"): Promise<string | undefined> {
    this.options.log?.debug(`getAccessToken: New token requested from ${source}`);

    const accessTokenExpiration = this.expiryStore.getAccessTokenExpiration();
    this.expiryStore.getRefreshTokenExpiration();

    if (accessTokenExpiration !== undefined) {
      const expiration = Math.trunc(new Date(accessTokenExpiration).getTime() / 1000);
      const now = Math.trunc(Date.now() / 1000);

      if (expiration > now) {
        this.options.log?.debug(`getAccessToken: ${source} => Cookie session is valid`);
        return undefined;
      }
    }

    if (this.tokenFetchPromise === undefined) {
      this.options.log?.debug(`getAccessToken: ${source} => No current token fetch, starting new fetch`);
      this.tokenFetchPromise = this.options.exchangeToken(undefined);
    }

    try {
      this.options.log?.debug(`getAccessToken: ${source} => Waiting for token fetch to complete`);
      const tokens = await this.tokenFetchPromise;

      this.expiryStore.setAccessTokenExpiration(tokens.accessTokenExpiration);
      if (tokens.refreshTokenExpiration !== undefined) {
        this.expiryStore.setRefreshTokenExpiration(tokens.refreshTokenExpiration);
      }

      if (this.options.refreshCallback !== undefined) {
        this.options.log?.debug(`getAccessToken: ${source} => Calling refresh callback with new tokens`);
        await this.options.refreshCallback(tokens);
      }
    } finally {
      this.tokenFetchPromise = undefined;
    }

    this.options.log?.debug(`getAccessToken: ${source} => Cookie session renewed`);
    return undefined;
  }

  /**
   * Forces the next authenticated request to renew the browser session.
   */
  public invalidate(): void {
    this.expiryStore.clear();
  }
}
