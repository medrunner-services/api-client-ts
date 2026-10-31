/**
 * Supplies bearer tokens for API and SignalR requests.
 *
 * Implementations own their acquisition and cache lifecycles so API transports
 * can request tokens without knowing which authentication flow produced them.
 */
export default interface AccessTokenProvider {
  /**
   * Gets a token for an authenticated request.
   *
   * `undefined` represents an authenticated cookie session that does not use a bearer header.
   */
  getAccessToken(source: string): Promise<string | undefined>;

  /**
   * Discards any cached token after a transport proves it is no longer valid.
   */
  invalidate(): void;
}
