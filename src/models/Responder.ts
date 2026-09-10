import { Class } from "./Class";

export default interface Responder {
  discordId: string;
  id: string;
  rsiHandle: string;
  class: Class;
  updated: string;
}
