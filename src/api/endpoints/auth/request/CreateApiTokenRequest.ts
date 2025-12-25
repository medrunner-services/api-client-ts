import { TokenScope } from "../../../../models/ApiToken";

/**
 * Request body for creating an api token.
 * */
export default interface CreateApiTokenRequest {
  /**
   * Human-readable name for the token
   * */
  name: string;

  /**
   * Optional expiration date for the token
   * */
  expirationDate?: Date;

  /**
   * List of scopes for the token
   * */
  scopes: TokenScope[];
}
