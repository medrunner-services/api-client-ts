import WritableDbItem from "./WritableDbItem";

export default interface PromotionalCode extends WritableDbItem {
  redeemerId: string;
  type: CodeType;
}

export enum CodeType {
  Unknown,
  CitizenCon2954,
}
