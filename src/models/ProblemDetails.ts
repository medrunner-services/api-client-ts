/**
 * Structured error details returned by the Medrunner API.
 *
 * The optional and nullable fields mirror the OpenAPI `ProblemDetails` schema exactly.
 */
export default interface ProblemDetails {
  type?: string | null;
  title?: string | null;
  status?: number | string | null;
  detail?: string | null;
  instance?: string | null;
}
