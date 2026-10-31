import type { WireComponents } from "../contracts/ApiContract";
/** All organization settings returned by the API. */
type OrgSettings = WireComponents["schemas"]["OrgSettings"];
export default OrgSettings;

/** Settings that may be consumed by public and client-facing applications. */
export type PublicOrgSettings = WireComponents["schemas"]["PublicSettings"];

/** Settings that govern staff-only features. */
export type StaffSettings = WireComponents["schemas"]["StaffSettings"];

/** Controls the certifications required for staff activities. */
export type CertificationSettings = WireComponents["schemas"]["CertificationSettings"];

/** The organization ships that staff may select. */
export type ShipSettings = WireComponents["schemas"]["ShipSettings"];

/** The organization units and their operational systems. */
export type UnitSettings = WireComponents["schemas"]["UnitSettings"];

/** Training registration configuration. */
export type TrainingSettings = WireComponents["schemas"]["TrainingSettings"];

/** Limits and requirements used while composing response teams. */
export type TeamSettings = WireComponents["schemas"]["TeamSettings"];

/** A message that may be shown to users for a bounded interval. */
export type MessageOfTheDay = WireComponents["schemas"]["MessageOfTheDay"];

/** The inclusive interval during which a message is displayed. */
export type DateRange = WireComponents["schemas"]["DateRange"];

/** The hierarchy of alert locations. */
export type LocationSettings = WireComponents["schemas"]["LocationSettings"];

/**
 * The minimal representation of an existing location.
 *
 * Emergency payloads include this base form rather than the complete location tree.
 */
export type LocationBase = WireComponents["schemas"]["LocationBase"];

/** A location at which an emergency may be submitted. */
export type SpaceLocation = WireComponents["schemas"]["Location"];

/** The hierarchy used to classify locations. */
export type LocationCategorySettings = WireComponents["schemas"]["LocationCategorySettings"];

/** A recursively nested location category. */
export type LocationCategory = WireComponents["schemas"]["LocationCategory"];

/** An organization ship. */
export type Ship = WireComponents["schemas"]["Ship"];

/** An organization unit and its linked systems. */
export type Unit = WireComponents["schemas"]["Unit"];

/** A Star Citizen system identified by its configured location. */
export type System = WireComponents["schemas"]["System"];

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
  POINT_OF_INTEREST = 6,
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
