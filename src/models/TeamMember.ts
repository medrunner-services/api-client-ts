import { Class } from "./Class";

export default interface TeamMember {
  discordId: string;
  id: string;
  rsiHandle: string;
  class: Class;
  updated: string;
}
