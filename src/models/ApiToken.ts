import WritableDbItem from "./WritableDbItem";

export default interface ApiToken extends WritableDbItem {
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

  /**
   *  Whether the token has expired
   * */
  expired: boolean;

  /**
   *  The version of the token
   * */
  version: TokenVersion;

  /**
   *  The scopes granted to the token
   * */
  scopes: TokenScope[];
}

export enum TokenVersion {
  UNKNOWN = -1,
  LEGACY = 0,
  V3 = 3,
  V4 = 4,
}

export enum TokenScope {
  CLIENT_READ = "client:read",
  CLIENT_WRITE = "client:write",
  CLIENT_PROFILE_READ = "client:profile:read",
  CLIENT_PROFILE_WRITE = "client:profile:write",
  CLIENT_ORGSETTINGS_READ = "client:orgsettings:read",
  STAFF_READ = "staff:read",
  STAFF_WRITE = "staff:write",
  STAFF_PROFILE_READ = "staff:profile:read",
  STAFF_PROFILE_WRITE = "staff:profile:write",
  STAFF_ORGSETTINGS_READ = "staff:orgsettings:read",
}
