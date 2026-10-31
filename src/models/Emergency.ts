import type { WireComponents } from "../contracts/ApiContract";
type Emergency = WireComponents["schemas"]["Emergency"];
export default Emergency;

/** A cached Discord message reference. */
export type DiscordMessage = WireComponents["schemas"]["MessageCache"];

export type ClientData = WireComponents["schemas"]["ClientData"];

export type AfterActionReport = WireComponents["schemas"]["AfterActionReport"];

export type AfterActionReportEdit = WireComponents["schemas"]["AfterActionReportEditRecord"];

export type AfterActionResource = WireComponents["schemas"]["AfterActionReportResource"];

export enum AfterActionResourceType {
  UNKNOWN = 0,
  VIDEO = 1,
}

export enum MissionServices {
  NONE = 0,
  PVE = 1 << 0,
  PVP = 1 << 1,
  REVIVED_HEALED = 1 << 2,
  HEALED_IN_SHIP = 1 << 3,
  EXTRACT_SAFE_ZONE = 1 << 4,
}

export enum Origin {
  UNKNOWN,
  REPORT,
  BEACON,
  EVALUATION,
}

export enum SubmissionSource {
  UNKNOWN,
  API,
  BOT,
}

export type RespondingTeam = WireComponents["schemas"]["RespondingTeam"];
