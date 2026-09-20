import ProblemDetails from "../models/ProblemDetails";

/** The HTTP methods issued by API endpoints. */
export type ApiRequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** A sanitized terminal API request failure that can be exported by capable loggers. */
export interface ApiRequestFailure {
  endpoint: string;
  method: ApiRequestMethod;
  serverAddress?: string;
  path?: string;
  statusCode?: number;
  retryCount: number;
  errorType: string;
  responseBody?: string;
  responseBodyTruncated: boolean;
  problemDetails?: ProblemDetails;
}

/** Optional logger capability for preserving API failure fields as structured log metadata. */
export interface ApiRequestFailureLogger {
  logApiRequestFailure(failure: ApiRequestFailure): void;
}
