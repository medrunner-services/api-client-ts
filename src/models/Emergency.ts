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
  remarks?: string;
  clientRsiHandle: string;
  clientDiscordId?: string;
  clientId?: string;
  subscriptionTier: string;
  status: MissionStatus;
  alertMessage?: MessageCache;
  clientMessage?: MessageCache;
  coordinationThread?: MessageCache;
  afterActionReportMessage?: MessageCache;
  interactionMessageId?: string;
  respondingTeam: Team;
  respondingTeams: RespondingTeam[];
  creationTimestamp: number;
  acceptedTimestamp?: number;
  completionTimestamp?: number;
  rating: ResponseRating;
  ratingRemarks?: string;
  test: boolean;
  cancellationReason: CancellationReason;
  refusalReason?: string;
  origin: Origin;
  clientData?: ClientData;
  isComplete: boolean;
  missionName?: string;
  afterActionReport?: AfterActionReport;
  submissionSource: SubmissionSource;
}

export interface MessageCache {
  id: string;
  channelId: string;
}

export interface ClientData {
  rsiHandle: string;
  rsiProfileLink: string;
  gotClientData: boolean;
  redactedOrgOnProfile: boolean;
  reported: boolean;
}

export interface AfterActionReport {
  remarks?: string;
  submitterStaffId: string;
  servicesProvided: MissionServices;
  suspectedTrap: boolean;
  hasBeenEdited: boolean;
  submittedOn: number;
  editHistory: AfterActionReportEdit[];
}

export interface AfterActionReportEdit {
  editorStaffId: string;
  editTime: number;
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
