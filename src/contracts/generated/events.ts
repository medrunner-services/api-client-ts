// Generated from the .NET event contracts. Do not edit.

export interface EventPayloads {
  Emergency: Emergency;
  Team: Team;
  Staff: Staff;
  Client: Client;
  ChatMessage: ChatMessage;
  AuditLog: AuditLog;
  FannedContent: FannedContent;
  Deployment: Deployment;
}
export interface Emergency {
  id: string;
  created: string;
  updated: string;
  system: {
    id: string;
    name: string;
    type: number;
    [k: string]: unknown;
  } | null;
  locationTreeNames: string[];
  locationId: string | null;
  threatLevel: number;
  clientRsiHandle: string | null;
  clientDiscordId: string | null;
  clientId: string | null;
  status: number;
  cancellationReason: number;
  refusalReason: string | null;
  alertMessage: {
    id: string;
    channelId: string;
    [k: string]: unknown;
  } | null;
  clientMessage: {
    id: string;
    channelId: string;
    [k: string]: unknown;
  } | null;
  coordinationThread: {
    id: string;
    channelId: string;
    [k: string]: unknown;
  } | null;
  afterActionReportMessage: {
    id: string;
    channelId: string;
    [k: string]: unknown;
  } | null;
  respondingTeam: {
    maxMembers: number;
    staff: Items[];
    dispatchers: Items[];
    allMembers: Items[];
    [k: string]: unknown;
  };
  respondingTeams: {
    id: string;
    teamName: string;
    [k: string]: unknown;
  }[];
  acceptedOn: string | null;
  completedOn: string | null;
  rating: number;
  ratingRemarks: string | null;
  origin: number;
  clientData: {
    rsiHandle: string;
    rsiProfileLink: string;
    gotClientData: boolean;
    reported: boolean;
    userSid: string | null;
    [k: string]: unknown;
  } | null;
  missionName: string | null;
  isComplete: boolean;
  afterActionReport: {
    servicesProvided: number;
    suspectedTrap: boolean;
    remarks: string | null;
    submitterStaffId: string;
    submittedOn: string | null;
    editHistory: {
      editorStaffId: string;
      editTime: string;
      [k: string]: unknown;
    }[];
    resources: {
      id: string;
      submitterStaffId: string;
      url: string;
      type: number;
      [k: string]: unknown;
    }[];
    hasBeenEdited: boolean;
    [k: string]: unknown;
  } | null;
  [k: string]: unknown;
}
export interface Items {
  discordId: string;
  id: string;
  rsiHandle: string;
  class: number;
  updated: string;
  [k: string]: unknown;
}
export interface Team {
  id: string;
  created: string;
  updated: string;
  emergency: {
    id: string;
    missionName: string;
    [k: string]: unknown;
  } | null;
  members: {
    discordId: string;
    id: string;
    rsiHandle: string;
    class: number;
    joinTime: string;
    [k: string]: unknown;
  }[];
  waitList: {
    userId: string;
    rsiHandle: string;
    joinTime: string;
    [k: string]: unknown;
  }[];
  status: number;
  unit: string;
  teamId: number;
  discordVoiceChannelId: string | null;
  order: number;
  teamName: string | null;
  [k: string]: unknown;
}
export interface Staff {
  certifications: {
    certificationType: number;
    acquiredOn: string;
    [k: string]: unknown;
  }[];
  rank: number;
  staffStats: {
    missions: Missions;
    missionSuccessRate: number;
    dispatchedMissions: DispatchedMissions;
    dispatchSuccessRate: number;
    classStats: ClassStats;
    level: number;
    [k: string]: unknown;
  };
  practiceStaffStats: {
    missions: Missions;
    missionSuccessRate: number;
    dispatchedMissions: DispatchedMissions;
    dispatchSuccessRate: number;
    classStats: ClassStats;
    level: number;
    [k: string]: unknown;
  };
  practiceClientStats: {
    missions: Missions1;
    [k: string]: unknown;
  };
  joinedMissions: {
    id: string;
    joinTime: string;
    [k: string]: unknown;
  }[];
  activeClass: number;
  staffProfile: {
    preferredPronoun: number;
    [k: string]: unknown;
  };
  lastSuspension: {
    enacted: string;
    expiration: string | null;
    [k: string]: unknown;
  } | null;
  activeTeam: string | null;
  departmentRoles: {
    academy: number;
    operations: number;
    logistics: number;
    hr: number;
    moderation: number;
    it: number;
    media: number;
    finance: number;
    community: number;
    [k: string]: unknown;
  };
  requestedTeam: string | null;
  staffPortalPreferencesBlob: string | null;
  terminationReason: string | null;
  isDispatch: boolean;
  isSuspended: boolean;
  id: string;
  created: string;
  updated: string;
  discordId: string;
  rsiHandle: string | null;
  hasCitizenId: boolean;
  roles: number;
  personType: number;
  active: boolean;
  deactivationReason: number;
  clientStats: {
    missions: Missions1;
    [k: string]: unknown;
  };
  clientPortalPreferencesBlob: string | null;
  activeEmergency: string | null;
  allowAnonymousAlert: boolean;
  initialJoinDate: string | null;
  [k: string]: unknown;
}
export interface Missions {
  success: number;
  failed: number;
  noContact: number;
  refused: number;
  aborted: number;
  serverError: number;
  canceled: number;
  [k: string]: unknown;
}
export interface DispatchedMissions {
  success: number;
  failed: number;
  noContact: number;
  refused: number;
  aborted: number;
  serverError: number;
  canceled: number;
  [k: string]: unknown;
}
export interface ClassStats {
  medic: number;
  security: number;
  pilot: number;
  lead: number;
  qrf: number;
  dispatch: number;
  dispatchLead: number;
  dispatchTrainee: number;
  observer: number;
  [k: string]: unknown;
}
export interface Missions1 {
  success: number;
  failed: number;
  noContact: number;
  refused: number;
  aborted: number;
  serverError: number;
  canceled: number;
  [k: string]: unknown;
}
export interface Client {
  id: string;
  created: string;
  updated: string;
  discordId: string;
  rsiHandle: string | null;
  hasCitizenId: boolean;
  roles: number;
  personType: number;
  active: boolean;
  deactivationReason: number;
  clientStats: {
    missions: {
      success: number;
      failed: number;
      noContact: number;
      refused: number;
      aborted: number;
      serverError: number;
      canceled: number;
      [k: string]: unknown;
    };
    [k: string]: unknown;
  };
  clientPortalPreferencesBlob: string | null;
  activeEmergency: string | null;
  allowAnonymousAlert: boolean;
  initialJoinDate: string | null;
  [k: string]: unknown;
}
export interface ChatMessage {
  id: string;
  created: string;
  updated: string;
  emergencyId: string;
  senderId: string;
  senderRsiHandle: string | null;
  contents: string;
  edited: boolean;
  deleted: boolean;
  senderClass: number;
  [k: string]: unknown;
}
export interface AuditLog {
  initiatorId: string | null;
  initiatorDiscordId: string;
  action: string;
  actionType: number;
  result: string;
  parameters:
    | {
        name: string;
        value: string;
        type: number;
        [k: string]: unknown;
      }[]
    | null;
  source: number;
  eventTime: string;
  timeToLive: string;
  id: string;
  created: string;
  [k: string]: unknown;
}
export interface FannedContent {
  id: string;
  [k: string]: unknown;
}
export interface Deployment {
  clientType: number;
  version: string;
  [k: string]: unknown;
}
