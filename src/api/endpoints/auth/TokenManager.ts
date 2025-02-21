import { Logger } from "ts-log";

import { AsyncAction, HeaderProvider } from "../../../Func";
import TokenGrant from "../../../models/TokenGrant";
import ApiEndpoint from "../ApiEndpoint";
import DefaultApiConfig from "../DefaultApiConfig";

export default class TokenManager extends ApiEndpoint {
  private accessToken?: string;
  private refreshToken?: string;
  private accessTokenExpiration?: string;
  private refreshTokenExpiration?: string;
  private tokenFetchPromise?: Promise<TokenGrant>;

  public constructor(
    config: DefaultApiConfig,
    private readonly refreshCallback?: AsyncAction<TokenGrant>,
    log?: Logger,
    headerProvider?: HeaderProvider,
  ) {
    // todo: I dunno fix this someday I guess?

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(config, null!, log, headerProvider);
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  protected override endpoint(): string {
    return "auth";
  }

  public async getAccessToken(source: string = "unknown"): Promise<string | undefined> {
    if (this.config.cookieAuth) {
      this.accessTokenExpiration = localStorage.getItem("accessTokenExpiration") ?? undefined;
    }

    this.log?.debug(`getAccessToken: New token requested from ${source}`);
    if ((this.accessToken !== undefined || this.config.cookieAuth) && this.accessTokenExpiration) {
      const exp = Math.trunc(new Date(this.accessTokenExpiration).getTime() / 1000);
      const now = Math.trunc(Date.now() / 1000);

      if (exp > now) {
        this.log?.debug(`getAccessToken: ${source} => Token valid and simply returned`);
        if (!this.config.cookieAuth) {
          return this.accessToken;
        } else {
          return undefined;
        }
      }
    }

    // if the refresh token isn't present, nothing we can do
    if (this.refreshToken === undefined && !this.config.cookieAuth) {
      this.log?.debug(`getAccessToken: ${source} => Missing refresh token, returning stored access token`);
      return this.accessToken;
    }

    // token is expired (or will expire soon) and there is not already one fetching, so fetch a new one
    if (!this.tokenFetchPromise) {
      this.log?.debug(`getAccessToken: ${source} => No current token fetch, starting new fetch`);
      this.tokenFetchPromise = this.fetchToken(this.refreshToken, source);
    }

    try {
      this.log?.debug(`getAccessToken: ${source} => Waiting for token fetch to complete`);
      const tokens = await this.tokenFetchPromise;

      this.log?.debug(`getAccessToken: ${source} => Setting new tokens in memory if no cookieAuth`);
      if (!this.config.cookieAuth) {
        this.accessToken = tokens.accessToken;
        this.refreshToken = tokens.refreshToken;
      } else {
        this.log?.debug(`getAccessToken: ${source} => Setting new token expirations in local storage`);
        localStorage.setItem("accessTokenExpiration", tokens.accessTokenExpiration);
        if (tokens.refreshTokenExpiration)
          localStorage.setItem("refreshTokenExpiration", tokens.refreshTokenExpiration);
      }

      this.accessTokenExpiration = tokens.accessTokenExpiration;
      if (tokens.refreshTokenExpiration) this.refreshTokenExpiration = tokens.refreshTokenExpiration;

      if (this.refreshCallback !== undefined) {
        this.log?.debug(`getAccessToken: ${source} => Calling refresh callback with new tokens`);
        await this.refreshCallback(tokens);
      }
    } finally {
      this.tokenFetchPromise = undefined;
    }

    this.log?.debug(`getAccessToken: ${source} => Returning new access token`);
    if (!this.config.cookieAuth) {
      return this.accessToken;
    } else {
      return undefined;
    }
  }

  private async fetchToken(refreshToken?: string, source: string = "unknown"): Promise<TokenGrant> {
    this.log?.debug(`getAccessToken: ${source} => Fetching new tokens`);
    const body = this.config.cookieAuth ? undefined : { refreshToken: refreshToken };
    const result = await this.postRequest<TokenGrant>("/exchange", body, true);

    if (!result.success || result.data === undefined) {
      throw Error(result.statusCode?.toString());
    }

    this.log?.debug(`getAccessToken: ${source} => Successfully fetched new tokens`);
    return result.data;
  }
}
