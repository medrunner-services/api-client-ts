import { ThreatLevel } from "../../../../models/ThreatLevel";

/**
 * Request body for creating a new emergency.
 * */
export default interface CreateEmergencyRequest {
  /**
   * Additional details or remarks to include
   * */
  remarks?: string;

  /**
   * The location of the emergency
   * */
  location: Location;

  /**
   * The threat level of the emergency
   *
   * @remarks
   * This will be removed in the future.
   * */
  threatLevel: ThreatLevel;
}

/**
 * Only real matching locations will be accepted (see /emergency/meta/locations).
 * */
export interface Location {
  /**
   * The star system the emergency is located in
   * */
  system: string;

  /**
   * The nearest planetary body to the emergency
   * */
  subsystem: string;

  /**
   * The nearest moon to the emergency, if applicable
   * */
  tertiaryLocation?: string;
}
