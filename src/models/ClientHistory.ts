import type { WireComponents } from "../contracts/ApiContract";
/** A record linking a client to an emergency in their history. */
type ClientHistory = WireComponents["schemas"]["ClientRecord"];
export default ClientHistory;
