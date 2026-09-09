import DbItem from "./DbItem";

/** A record linking a client to an emergency in their history. */
export default interface ClientHistory extends DbItem {
  emergencyId: string;
  clientId: string;
}
