/** All organization settings returned by the API. */
export default interface OrgSettings {
  public: PublicOrgSettings;
  staff: StaffSettings;
}

/** Settings that may be consumed by public and client-facing applications. */
export interface PublicOrgSettings {
  status: ServiceStatus;
  emergenciesEnabled: boolean;
  anonymousAlertsEnabled: boolean;
  messageOfTheDay: MessageOfTheDay | null;
  locationSettings: LocationSettings;
  locationCategorySettings: LocationCategorySettings;
  registrationEnabled: boolean;
}

/** Settings that govern staff-only features. */
export interface StaffSettings {
  messageOfTheDay: MessageOfTheDay | null;
  beaconsEnabled: boolean;
  certifications: CertificationSettings;
  shipSettings: ShipSettings;
  unitSettings: UnitSettings;
  training: TrainingSettings;
  team: TeamSettings;
}

/** Controls the certifications required for staff activities. */
export interface CertificationSettings {
  basicCertificationEnabled: boolean;
}

/** The organization ships that staff may select. */
export interface ShipSettings {
  ships: Ship[];
}

/** The organization units and their operational systems. */
export interface UnitSettings {
  units: Unit[];
}

/** Training registration configuration. */
export interface TrainingSettings {
  registrationCutoffWindowMinutes: number | string;
}

/** Limits and requirements used while composing response teams. */
export interface TeamSettings {
  alertMaxSize: number | string;
  beaconMaxSize: number | string;
  trainingMaxSize: number | string;
  enforceHardCap: boolean;
  requiredCertifications: Record<string, CertificationType[]>;
  enforceTeams: boolean;
  autoAdjustOrderOnAlertCompletion: boolean;
}

/** A message that may be shown to users for a bounded interval. */
export interface MessageOfTheDay {
  message: string;
  dateRange: DateRange | null;
}

/** The inclusive interval during which a message is displayed. */
export interface DateRange {
  startDate: string;
  endDate: string;
}

/** The hierarchy of alert locations. */
export interface LocationSettings {
  locations: SpaceLocation[];
}

/** A location at which an emergency may be submitted. */
export interface SpaceLocation {
  id: string;
  name: string;
  type: SpaceLocationType;
  children: SpaceLocation[];
  enabled: boolean;
  visibleForAlertSubmissions: boolean;
  alertLocation: boolean;
  characteristics: LocationCharacteristic[];
}

/** The hierarchy used to classify locations. */
export interface LocationCategorySettings {
  locationCategories: LocationCategory[];
}

/** A recursively nested location category. */
export interface LocationCategory {
  id: string;
  name: string;
  active: boolean;
  children: LocationCategory[];
}

/** An organization ship. */
export interface Ship {
  id: string;
  name: string;
  active: boolean;
}

/** An organization unit and its linked systems. */
export interface Unit {
  unitName: string;
  primarySystems: System[];
  secondarySystems: System[];
  discordCategoryId: string;
  discordRoleId: string;
  musterPointId: string;
}

/** A named Star Citizen system. */
export interface System {
  name: string;
}

/** A staff certification type. */
export enum CertificationType {
  Unknown,
  Basic,
}

/** The supported classifications for a location. */
export enum SpaceLocationType {
  UNKNOWN = 0,
  SYSTEM = 1,
  PLANET = 2,
  MOON = 3,
  STATION = 4,
  OUTER_SPACE = 5,
}

/** The availability of Medrunner services. */
export enum ServiceStatus {
  UNKNOWN = 0,
  OPERATIONAL = 1,
  SLIGHTLY_DEGRADED = 2,
  HEAVILY_DEGRADED = 3,
  OFFLINE = 4,
}

/** A condition that can affect emergency response at a location. */
export enum LocationCharacteristic {
  UNKNOWN = 0,
  HIGH_TEMPERATURE = 1,
  LOW_TEMPERATURE = 2,
  HOSTILE_ATMOSPHERE = 3,
}
