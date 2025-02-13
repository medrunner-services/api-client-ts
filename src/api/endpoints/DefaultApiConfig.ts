import ApiConfig from "../ApiConfig";

export default class DefaultApiConfig {
  public readonly baseUrl: string;
  public readonly accessToken?: string;
  public readonly refreshToken?: string;
  public readonly cookieAuth: boolean;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl ?? "https://api.medrunner.space";
    this.accessToken = config.accessToken;
    this.refreshToken = config.refreshToken;
    this.cookieAuth = config.cookieAuth ?? false;
  }
}
