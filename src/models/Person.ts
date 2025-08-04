import EmergencyStats from "./EmergencyStats";
import WritableDbItem from "./WritableDbItem";

export default interface Person extends WritableDbItem {
  discordId: string;
  rsiHandle?: string;
  roles: UserRoles;
  personType: PersonType;
  active: boolean;
  deactivationReason: AccountDeactivationReason;
  clientStats: ClientStats;
  activeEmergency?: string;
  clientPortalPreferencesBlob?: string;
  allowAnonymousAlert: boolean;
  initialJoinDate?: string;
}

export enum UserRoles {
  CLIENT = 1 << 0,
  STAFF = 1 << 1,
  //@ts-expect-error - valid range
  CEO = 1 << 50,
  //@ts-expect-error - valid range
  DEVELOPER = 1 << 51,
  //@ts-expect-error - valid range
  BOT = 1 << 52,
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

export interface ClientStats {
  missions: EmergencyStats;
}

export interface BlockedStatus {
  blocked: boolean;
}
