import type { WireComponents } from "../contracts/ApiContract";
/**
 * Structured error details returned by the Medrunner API.
 *
 * The optional and nullable fields mirror the OpenAPI `ProblemDetails` schema exactly.
 */
type ProblemDetails = WireComponents["schemas"]["ProblemDetails"];
export default ProblemDetails;
