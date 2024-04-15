import { Level } from "../../../../models/Level";

/**
 * Information about a medal
 * */
export default interface MedalInformation {
  /**
   * The level linked to the medal
   * */
  level: Level;

  /**
   * The number of successful missions required to earn the medal
   * */
  successfulMissions: number;
}
