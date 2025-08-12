import DbItem from "./DbItem";

export default interface ApiToken extends DbItem {
  /**
   * The user who created the token
   * */
  userId: string;

  /**
   * Human-readable name for the token, assigned by the user
   * */
  name: string;

  /**
   * The date at which the token will expire
   * */
  expirationDate?: string;

  /**
   *  When the token was last used to generate a new access token, iso-8601 timestamp
   * */
  lastUsed?: string;
}
