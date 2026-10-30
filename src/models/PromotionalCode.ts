import type { WireComponents } from "../contracts/ApiContract";
/** A promotional code and the client that redeemed it, when applicable. */
type PromotionalCode = WireComponents["schemas"]["RedeemableCode"];
export default PromotionalCode;

export enum CodeType {
  UNKNOWN,
  CITIZEN_CON_2954,
}
