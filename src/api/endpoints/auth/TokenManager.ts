import axios, { AxiosError, type AxiosRequestConfig } from "axios";
import { Logger } from "ts-log";

import { AsyncAction, HeaderProvider } from "../../../Func";
import TokenGrant from "../../../models/TokenGrant";
import AccessTokenProvider from "../../auth/AccessTokenProvider";
import CookieAuthTokenProvider from "../../auth/CookieAuthTokenProvider";
import StaticRefreshTokenProvider, { TokenExchange } from "../../auth/StaticRefreshTokenProvider";
import ApiEndpoint from "../ApiEndpoint";
import DefaultApiConfig from "../DefaultApiConfig";

/**
 * Selects the configured authentication provider and retains the legacy
 * `/auth/exchange` transport for refresh-token and cookie-session flows.
 */
export default class TokenManager extends ApiEndpoint {
  public readonly provider: AccessTokenProvider;

  public constructor(
    config: DefaultApiConfig,
    refreshCallback?: AsyncAction<TokenGrant>,
    log?: Logger,
    private readonly tokenExchangeHeaderProvider?: HeaderProvider,
    exchangeToken?: TokenExchange,
  ) {
    // TokenManager owns provider selection, so it never uses the base endpoint's token manager.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    super(config, null!, log, tokenExchangeHeaderProvider);

    const exchange =
      exchangeToken ?? ((refreshToken: string | undefined): Promise<TokenGrant> => this.exchangeToken(refreshToken));

    if (config.accessTokenProvider !== undefined) {
      this.provider = config.accessTokenProvider;
    } else if (config.cookieAuth) {
      this.provider = new CookieAuthTokenProvider({
        exchangeToken: exchange,
        refreshCallback,
        log,
      });
    } else {
      this.provider = new StaticRefreshTokenProvider({
        accessToken: config.accessToken,
        refreshToken: config.refreshToken,
        exchangeToken: exchange,
        refreshCallback,
        log,
      });
    }
  }

  /**
   * Gets a token from the selected provider for API or SignalR transport use.
   */
  public async getAccessToken(source: string = "unknown"): Promise<string | undefined> {
    return await this.provider.getAccessToken(source);
  }

  /**
   * Invalidates any provider cache after an authenticated request is rejected.
   */
  public invalidateAccessToken(): void {
    this.provider.invalidate();
  }

  protected override endpoint(): string {
    return "auth";
  }

  private async exchangeToken(refreshToken?: string): Promise<TokenGrant> {
    this.log?.debug("getAccessToken: Fetching new tokens");

    try {
      const headers =
        this.tokenExchangeHeaderProvider === undefined ? undefined : await this.tokenExchangeHeaderProvider();
      const body = this.config.cookieAuth ? undefined : { refreshToken };
      const result = await axios.post<TokenGrant>(`${this.config.baseUrl}/auth/exchange`, body, {
        headers: headers as AxiosRequestConfig["headers"],
        withCredentials: this.config.cookieAuth,
      });

      this.log?.debug("getAccessToken: Successfully fetched new tokens");
      return result.data;
    } catch (error) {
      const statusCode = error instanceof AxiosError ? error.response?.status : undefined;
      throw new Error(statusCode?.toString(), { cause: error });
    }
  }
}
