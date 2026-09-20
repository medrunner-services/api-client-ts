import ApiConfig from "../ApiConfig";
import AccessTokenProvider from "../auth/AccessTokenProvider";

/**
 * Normalizes API configuration and prevents ambiguous authentication choices.
 */
export default class DefaultApiConfig {
  public readonly baseUrl: string;
  public readonly accessToken?: string;
  public readonly refreshToken?: string;
  public readonly cookieAuth: boolean;
  public readonly accessTokenProvider?: AccessTokenProvider;

  constructor(config: ApiConfig) {
    const hasLegacyAuthentication =
      config.accessToken !== undefined || config.refreshToken !== undefined || config.cookieAuth === true;

    if (config.accessTokenProvider !== undefined && hasLegacyAuthentication) {
      throw new Error(
        "accessTokenProvider cannot be combined with accessToken, refreshToken, or cookieAuth authentication.",
      );
    }

    this.baseUrl = config.baseUrl ?? "https://api.medrunner.space";
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.cookieAuth = config.cookieAuth ?? false;
    this.accessTokenProvider = config.accessTokenProvider;
  }
}
