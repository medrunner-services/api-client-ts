import WritableDbItem from "./WritableDbItem";

export default interface OrgSettings extends WritableDbItem {
  public: PublicOrgSettings;
}

export interface PublicOrgSettings {
  status: ServiceStatus;
  emergenciesEnabled: boolean;
  anonymousAlertsEnabled: boolean;
  registrationEnabled: boolean;
  messageOfTheDay?: MessageOfTheDay;
  locationSettings: LocationSettings;
}

export interface MessageOfTheDay {
  message: string;
  dateRange?: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface LocationSettings {
  locations: SpaceLocation[];
}

export interface SpaceLocation {
  name: string;
  type: SpaceLocationType;
  children: SpaceLocation[];
  enabled: boolean;
}

export enum SpaceLocationType {
  UNKNOWN = 0,
  SYSTEM = 1,
  PLANET = 2,
  MOON = 3,
}

export enum ServiceStatus {
  UNKNOWN = 0,
  HEALTHY = 1,
  SLIGHTLY_DEGRADED = 2,
  HEAVILY_DEGRADED = 3,
  OFFLINE = 4,
}
