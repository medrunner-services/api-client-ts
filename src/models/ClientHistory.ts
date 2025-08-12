import DbItem from "./DbItem";

export default interface ClientHistory extends DbItem {
  emergencyId: string;
  clientId: string;
}
