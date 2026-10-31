import type { WireComponents } from "../../../../contracts/ApiContract";

/** Optional RSI handle defaults to the authenticated caller's account. */
type CreateEmergencyRequest = WireComponents["schemas"]["NewEmergencyRequest"];
export default CreateEmergencyRequest;
