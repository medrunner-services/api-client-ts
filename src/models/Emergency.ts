import { CancellationReason } from "./CancellationReason";
import { MissionStatus } from "./MissionStatus";
import { ResponseRating } from "./ResponseRating";
import Team from "./Team";
import { ThreatLevel } from "./ThreatLevel";
import WritableDbItem from "./WritableDbItem";

export default interface Emergency extends WritableDbItem {
  system: string;
  subsystem: string;
  tertiaryLocation?: string;
  threatLevel: ThreatLevel;
  clientRsiHandle: string;
  clientDiscordId?: string;
  clientId?: string;
  subscriptionTier: string;
  status: MissionStatus;
  cancellationReason: CancellationReason;
  refusalReason?: string;
  alertMessage?: DiscordMessage;
  clientMessage?: DiscordMessage;
  coordinationThread?: DiscordMessage;
  afterActionReportMessage?: DiscordMessage;
  respondingTeam: Team;
  respondingTeams: RespondingTeam[];
  acceptedOn?: string;
  completedOn?: string;
  rating: ResponseRating;
  ratingRemarks?: string;
  origin: Origin;
  clientData?: ClientData;
  missionName?: string;
  isComplete: boolean;
  afterActionReport?: AfterActionReport;
}

export interface DiscordMessage {
  id: string;
  channelId: string;
}

export interface ClientData {
  rsiHandle: string;
  rsiProfileLink: string;
  gotClientData: boolean;
  reported: boolean;
  userSid?: string;
}

export interface AfterActionReport {
  servicesProvided: MissionServices;
  suspectedTrap: boolean;
  remarks?: string;
  submitterStaffId: string;
  submittedOn?: string;
  editHistory: AfterActionReportEdit[];
  hasBeenEdited: boolean;
}

export interface AfterActionReportEdit {
  editorStaffId: string;
  editTime: string;
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
