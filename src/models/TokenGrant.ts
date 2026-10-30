import type { WireComponents } from "../contracts/ApiContract";

/** Complete authentication response; a non-expiring refresh token has an explicit null expiration. */
type TokenGrant = WireComponents["schemas"]["TokenPair"];
export default TokenGrant;
