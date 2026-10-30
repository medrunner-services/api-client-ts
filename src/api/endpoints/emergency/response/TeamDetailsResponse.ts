import type { WireComponents } from "../../../../contracts/ApiContract";
/** Details about the responders assigned to an alert. */
type TeamDetailsResponse = WireComponents["schemas"]["TeamDetails"];
export default TeamDetailsResponse;

/** Details about an alert responder. */
export type ResponderDetails = WireComponents["schemas"]["ResponderDetails"];
