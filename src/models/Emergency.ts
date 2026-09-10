import { CancellationReason } from "./CancellationReason";
import { MissionStatus } from "./MissionStatus";
import { ResponseRating } from "./ResponseRating";
import Team from "./Team";
import { ThreatLevel } from "./ThreatLevel";
import WritableDbItem from "./WritableDbItem";

export default interface Emergency extends WritableDbItem {
  system: string;
  locationId: string | null;
  threatLevel: ThreatLevel;
  clientRsiHandle: string | null;
  clientDiscordId: string | null;
  clientId: string | null;
  status: MissionStatus;
  cancellationReason: CancellationReason;
  refusalReason: string | null;
  alertMessage: DiscordMessage | null;
  clientMessage: DiscordMessage | null;
  coordinationThread: DiscordMessage | null;
  afterActionReportMessage: DiscordMessage | null;
  respondingTeam: Team;
  respondingTeams: RespondingTeam[];
  acceptedOn: string | null;
  completedOn: string | null;
  rating: ResponseRating;
  ratingRemarks: string | null;
  origin: Origin;
  clientData: ClientData | null;
  missionName: string | null;
  isComplete: boolean;
  afterActionReport: AfterActionReport | null;
}

/** A cached Discord message reference. */
export interface DiscordMessage {
  id: string;
  channelId: string;
}

export interface ClientData {
  rsiHandle: string;
  rsiProfileLink: string;
  gotClientData: boolean;
  reported: boolean;
  userSid: string | null;
}

export interface AfterActionReport {
  servicesProvided: MissionServices;
  suspectedTrap: boolean;
  remarks: string | null;
  submitterStaffId: string;
  submittedOn: string | null;
  editHistory: AfterActionReportEdit[];
  hasBeenEdited: boolean;
  resources: AfterActionResource[];
}

export interface AfterActionReportEdit {
  editorStaffId: string;
  editTime: string;
}

export interface AfterActionResource {
  id: string;
  submitterStaffId: string;
  type: AfterActionResourceType;
  url: string;
}

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

export interface RespondingTeam {
  id: string;
  teamName: string;
}
