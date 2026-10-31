import ProblemDetails from "../models/ProblemDetails";

export default interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  errorMessage?: string;
  statusCode?: number;
  /** Structured error details supplied by the API, when the failed response uses that schema. */
  problemDetails?: ProblemDetails;
}
