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

  public async getAccessToken(): Promise<string | undefined> {
    if (this.accessToken !== undefined) {
      const exp = TokenManager.getJwtFromAccessToken(this.accessToken).exp;

      // check expiration minus 5 minutes to guard against race condition or timing issues creating unnecessary 403s
      if (exp > Date.now() / 1000) return this.accessToken;
    }

    // if the refresh token isn't present, nothing we can do
    if (this.refreshToken === undefined) return this.accessToken;

    // token is expired (or will expire soon) and there is not already one fetching, so fetch a new one
    if (!this.tokenFetchPromise) this.tokenFetchPromise = this.fetchToken(this.refreshToken);

    try {
      const tokens = await this.tokenFetchPromise;
      this.accessToken = tokens.accessToken;
      this.refreshToken = tokens.refreshToken;

      if (this.refreshCallback !== undefined) {
        await this.refreshCallback(tokens);
      }
    } finally {
      this.tokenFetchPromise = undefined;
    }

    return this.accessToken;
  }

  private async fetchToken(refreshToken: string): Promise<TokenGrant> {
    const result = await this.postRequest<TokenGrant>("/exchange", { refreshToken: refreshToken }, true);

    if (!result.success || result.data === undefined) {
      throw Error(result.statusCode?.toString());
    }

    return result.data;
  }

  private static getJwtFromAccessToken(accessToken: string): Jwt {
    return JSON.parse(atob(accessToken.split(".")[1]));
  }
}

interface Jwt {
  exp: number;
}
