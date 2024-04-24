/**
 * Configuration for the Medrunner API.
 * */
export default interface ApiConfig {
  /**
   * The base URL of the API - defaults to https://api.medrunner.space
   * */
  baseUrl?: string;

  /**
   * Your API token retrieved after logging in. If none is provided, the refresh token will be used to retrieve an
   * access token.
   * */
  accessToken?: string;

  /**
   * Your refresh token, used to obtain new API tokens. If none is provided, authenticated requests will not be possible
   * when the {@link accessToken} expires. If no access token is provided either, only unauthenticated requests are
   * possible.
   * */
  refreshToken?: string;
}
