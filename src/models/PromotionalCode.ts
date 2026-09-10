import WritableDbItem from "./WritableDbItem";

/** A promotional code and the client that redeemed it, when applicable. */
export default interface PromotionalCode extends WritableDbItem {
  type: CodeType;
  redeemerId: string | null;
}

export enum CodeType {
  UNKNOWN,
  CITIZEN_CON_2954,
}
