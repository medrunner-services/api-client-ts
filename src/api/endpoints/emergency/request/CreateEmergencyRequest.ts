import { ThreatLevel } from "../../../../models/ThreatLevel";

/** Request body for creating a new emergency. */
export default interface CreateEmergencyRequest {
  /** The location id of the emergency. */
  locationId: string;

  /** The threat level of the emergency. */
  threatLevel: ThreatLevel;

  /** The RSI handle of the client, or `null` when it is not supplied. */
  rsiHandle: string | null;
}
