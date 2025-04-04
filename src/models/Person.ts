import EmergencyStats from "./EmergencyStats";
import { CodeType } from "./PromotionalCode";
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
  /**
   * @deprecated Use {@link Person.clientPortalPreferencesBlob} instead.
   */
  clientPortalPreferences: Record<string, unknown>;
  /**
   * @deprecated Fetch this information via {@link client.getRedeemedCodes} instead.
   */
  redeemedCodes: RedeemedCode[];
  clientPortalPreferencesBlob?: string;
  allowAnonymousAlert: boolean;
  initialJoinDate?: string;
}

export enum UserRoles {
  CLIENT = 1 << 0,
  STAFF = 1 << 1,
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
  TERMINATED,
  BLOCKED,
}

export interface ClientStats {
  missions: EmergencyStats;
}

export interface BlockedStatus {
  blocked: boolean;
}

export interface RedeemedCode {
  code: string;
  type: CodeType;
}
