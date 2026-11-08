import type { WirePaths } from "../contracts/ApiContract";
/**
 * Structured error details returned by the Medrunner API.
 *
 * The optional and nullable fields mirror the OpenAPI `ProblemDetails` schema exactly.
 */
export type RecruitmentProblemDetails =
  WirePaths["/Staff/recruit"]["post"]["responses"][409]["content"]["application/problem+json"];
export type RecruitmentFailureData = NonNullable<RecruitmentProblemDetails["data"]>;
// Partial keeps older servers' standard Problem Details responses compatible.
type ProblemDetails = Partial<
  WirePaths["/Auth/exchange"]["post"]["responses"][400]["content"]["application/problem+json"]
> & {
  data?: RecruitmentFailureData | null;
  /** Additive machine-readable reason; unknown values remain available for generic fallback. */
  reason?: string | null;
};
export default ProblemDetails;
