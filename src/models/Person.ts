import type { WireComponents } from "../contracts/ApiContract";
type Person = WireComponents["schemas"]["Person"];
export default Person;

export enum UserRoles {
  CLIENT = 1 << 0,
  STAFF = 1 << 1,
  CEO = 2 ** 50,
  DEVELOPER = 2 ** 51,
  BOT = 2 ** 52,
}

export enum PersonType {
  CLIENT,
  STAFF,
  BOT,
}

export enum AccountDeactivationReason {
  NONE,
  CLIENT_DRIVEN_DELETION,
}

export type ClientStats = WireComponents["schemas"]["ClientStats"];

export type BlockedStatus = WireComponents["schemas"]["BlockedResponse"];
