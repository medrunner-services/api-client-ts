import { Level } from "../../../../models/Level";

/**
 * Details about a team responding to an alert.
 * */
export default interface TeamDetailsResponse {
  /**
   * Details about each individual responder.
   * */
  stats: ResponderDetails[];

  /**
   * The aggregated mission success rate from all responders, appropriately weighted by number of missions.
   * */
  aggregatedSuccessRate: number;
}

/**
 * Details about an alert responder.
 * */
export interface ResponderDetails {
  /**
   * The responder's id.
   * */
  id: string;

  /**
   * The responder's level.
   * */
  level: Level;

  /**
   * The success rate of all prior missions this staff member has responded to.
   * */
  missionSuccessRate: number;

  /**
   * The success rate of all prior missions this staff member has acted as a dispatcher for.
   * */
  dispatchSuccessRate: number;
}
