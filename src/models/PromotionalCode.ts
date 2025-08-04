import WritableDbItem from "./WritableDbItem";

export default interface PromotionalCode extends WritableDbItem {
  redeemerId?: string;
  type: CodeType;
}

export enum CodeType {
  UNKNOWN,
  CITIZEN_CON_2954,
}
