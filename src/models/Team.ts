import Responder from "./Responder";

/** The responders assigned to an emergency. */
export default interface Team {
  maxMembers: number | string;
  staff: Responder[];
  dispatchers: Responder[];
  allMembers: Responder[];
}
