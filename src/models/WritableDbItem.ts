import DbItem from "./DbItem";

export default interface WritableDbItem extends DbItem {
  updated: string;
}
