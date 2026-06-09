import { ThreatLevel } from "../../../../models/ThreatLevel";

/**
 * Request body for creating a new emergency.
 * */
export default interface CreateEmergencyRequest {
  /**
   * The location id of the SpaceLocation of the emergency
   * */
  locationId: string;

  /**
   * The threat level of the emergency
   *
   * @remarks
   * This will be removed in the future.
   * */
  threatLevel: ThreatLevel;

  /**
   * The rsiHandle of the client
   *
   * @remarks
   * This is optional, if the client already has an RSI handle set on his profile, this will be ignored.
   * */
  rsiHandle?: string;
}
