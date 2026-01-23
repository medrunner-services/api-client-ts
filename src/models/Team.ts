import Responder from "./Responder";

export default interface Team {
  maxMembers: number;
  staff: Responder[];
  dispatchers: Responder[];
  allMembers: Responder[];
}
