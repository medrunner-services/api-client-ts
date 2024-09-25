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
  clientPortalPreferences: Record<string, unknown>;
}

export enum UserRoles {
  CLIENT = 1 << 0,
  STAFF = 1 << 1,
  DEVELOPER = 1 << 51,
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
  TERMINATED,
  BLOCKED,
}

export interface ClientStats {
  missions: EmergencyStats;
}

export interface BlockedStatus {
  blocked: boolean;
}
