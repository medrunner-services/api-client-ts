import { Logger } from "ts-log";

import { AsyncAction, HeaderProvider } from "../../../Func";
import TokenGrant from "../../../models/TokenGrant";
import ApiConfig from "../../ApiConfig";
import ApiEndpoint from "../ApiEndpoint";

export default class TokenManager extends ApiEndpoint {
  private accessToken?: string;
  private refreshToken?: string;
  private tokenFetchPromise?: Promise<TokenGrant>;

  public constructor(
    config: ApiConfig,
    private readonly refreshCallback?: AsyncAction<TokenGrant>,
    log?: Logger,
    headerProvider?: HeaderProvider,
  ) {
    // todo: I dunno fix this someday I guess?

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(config.baseUrl, null!, log, headerProvider);
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
  }

  protected override endpoint(): string {
    return "auth";
  }

  public async getAccessToken(source: string = "unknown"): Promise<string | undefined> {
    this.log?.debug(`getAccessToken: New token requested from ${source}`);
    if (this.accessToken !== undefined) {
      const exp = TokenManager.getJwtFromAccessToken(this.accessToken).exp;

      // check expiration minus 5 minutes to guard against race condition or timing issues creating unnecessary 403s
      if (exp > Date.now() / 1000 - 60 * 5) {
        this.log?.debug(`getAccessToken: ${source} => Token valid and simply returned`);
        return this.accessToken;
      }
    }

    // if the refresh token isn't present, nothing we can do
    if (this.refreshToken === undefined) {
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

      this.log?.debug(`getAccessToken: ${source} => Setting new tokens in memory`);
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;

      if (this.refreshCallback !== undefined) {
        this.log?.debug(`getAccessToken: ${source} => Calling refresh callback with new tokens`);
        await this.refreshCallback(tokens);
      }
    } finally {
      this.tokenFetchPromise = undefined;
    }

    this.log?.debug(`getAccessToken: ${source} => Returning new access token`);
    return this.accessToken;
  }

  private async fetchToken(refreshToken: string, source: string = "unknown"): Promise<TokenGrant> {
    this.log?.debug(`getAccessToken: ${source} => Fetching new tokens`);
    const result = await this.postRequest<TokenGrant>("/exchange", { refreshToken: refreshToken }, true);

    if (!result.success || result.data === undefined) {
      throw Error(result.statusCode?.toString());
    }

    this.log?.debug(`getAccessToken: ${source} => Successfully fetched new tokens`);
    return result.data;
  }

  private static getJwtFromAccessToken(accessToken: string): Jwt {
    return JSON.parse(atob(accessToken.split(".")[1]));
  }
}

interface Jwt {
  exp: number;
}
