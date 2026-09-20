import { Level } from "../../../../models/Level";

/** Details about the responders assigned to an alert. */
export default interface TeamDetailsResponse {
  /** Statistics for each responder. */
  stats: ResponderDetails[];

  /** The success rate across all responders. */
  aggregatedSuccessRate: number;
}

/** Details about an alert responder. */
export interface ResponderDetails {
  /** The responder's id. */
  id: string;

  /** The responder's level. */
  level: Level;

  /** The success rate for missions to which this staff member responded. */
  missionSuccessRate: number;

  /** The success rate for missions this staff member dispatched. */
  dispatchSuccessRate: number;
}
