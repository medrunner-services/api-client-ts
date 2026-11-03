import axios, { type AxiosResponse } from "axios";

import { ApiContractError, assertHttpResponse } from "../contracts/ApiContract";
import type ProblemDetails from "../models/ProblemDetails";
import type { RecruitmentFailureData } from "../models/ProblemDetails";
import type ApiResponse from "./ApiResponse";

type ResponseContext = Pick<AxiosResponse, "status" | "headers"> & { data?: unknown };

/** Sanitized typed failure for token acquisition and response-contract validation. */
export class ApiFailureError extends Error {
  public readonly statusCode?: number;
  public readonly requestId?: string;
  public readonly traceId?: string;
  public readonly problemDetails?: ProblemDetails;
  public readonly failureKind?: ApiResponse["failureKind"];

  public constructor(public readonly response: ApiResponse<never>) {
    super(response.statusCode?.toString() ?? response.errorMessage ?? "API request failed");
    this.name = "ApiFailureError";
    this.statusCode = response.statusCode;
    this.requestId = response.requestId;
    this.traceId = response.traceId;
    this.problemDetails = response.problemDetails;
    this.failureKind = response.failureKind;
  }
}

/** Accepts opaque printable server identifiers, never control characters or compound header values. */
export function apiDiagnosticId(value: unknown): string | undefined {
  return typeof value === "string" && /^[\x21-\x2b\x2d-\x7e]{1,256}$/.test(value) ? value : undefined;
}

/** Validates a response while retaining only safe HTTP context if validation fails. */
export function validateApiResponse(method: string, path: string, response: AxiosResponse): void {
  try {
    assertHttpResponse(method, path, response.status, response.data);
  } catch (error) {
    throw new ApiFailureError(normalizeApiFailure<never>(error, response));
  }
}

/** The only transport-to-result normalization used by endpoints and token exchange. */
export function normalizeApiFailure<T = unknown>(error: unknown, received?: ResponseContext): ApiResponse<T> {
  if (error instanceof ApiFailureError) return { ...error.response };
  const response = axios.isAxiosError(error) ? error.response : undefined;
  const context = received ?? response;
  const errorData: unknown = context?.data ?? response?.data;
  const problemDetails = readProblemDetails(errorData, context?.status);
  const headerId = apiDiagnosticId(context?.headers["x-request-id"] ?? context?.headers["X-Request-ID"]);
  const bodyId = apiDiagnosticId(problemDetails?.requestId);
  return {
    success: false,
    statusCode: context?.status,
    requestId: headerId ?? bodyId,
    traceId: apiDiagnosticId(problemDetails?.traceId),
    failureKind: axios.isCancel(error)
      ? "cancelled"
      : error instanceof ApiContractError
        ? "contract"
        : context
          ? "http"
          : "transport",
    ...(headerId && bodyId && headerId !== bodyId ? { requestIdMismatch: true } : {}),
    errorMessage: error instanceof ApiContractError ? error.message : serializeErrorBody(errorData),
    problemDetails,
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function nullableString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === "string";
}

function integer(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isSafeInteger(value)) return value;
  if (typeof value === "string" && /^-?(?:0|[1-9]\d*)$/.test(value) && Number.isSafeInteger(Number(value)))
    return Number(value);
  return undefined;
}

function recruitmentData(value: unknown): RecruitmentFailureData | undefined {
  if (!isRecord(value)) return undefined;
  if (!["staffMemberId", "terminationReason", "discordId", "rsiHandle"].every(key => nullableString(value[key])))
    return undefined;
  const ids = value.matchingAccountIds;
  if (ids != null && (!Array.isArray(ids) || !ids.every(id => typeof id === "string"))) return undefined;
  // Reading each property again through its guard keeps this projection explicitly typed.
  return {
    staffMemberId: typeof value.staffMemberId === "string" ? value.staffMemberId : null,
    terminationReason: typeof value.terminationReason === "string" ? value.terminationReason : null,
    discordId: typeof value.discordId === "string" ? value.discordId : null,
    rsiHandle: typeof value.rsiHandle === "string" ? value.rsiHandle : null,
    matchingAccountIds: Array.isArray(ids) ? ids.filter((id): id is string => typeof id === "string") : null,
  };
}

function readProblemDetails(value: unknown, statusCode?: number): ProblemDetails | undefined {
  if (!isRecord(value)) return undefined;
  const legacyDomain = integer(value.errorCode) !== undefined && nullableString(value.message);
  if (!legacyDomain && !["type", "title", "status", "detail", "instance"].some(key => key in value)) return undefined;
  if (!["type", "title", "detail", "instance"].every(key => nullableString(value[key]))) return undefined;
  if (value.status != null && integer(value.status) === undefined) return undefined;
  const errors: Record<string, string[]> = {};
  if (isRecord(value.errors)) {
    for (const [field, messages] of Object.entries(value.errors)) {
      if (!Array.isArray(messages) || !messages.every(message => typeof message === "string")) return undefined;
      Object.defineProperty(errors, field, { value: messages, enumerable: true, configurable: true, writable: true });
    }
  }
  return {
    ...(typeof value.type === "string" || value.type === null ? { type: value.type } : {}),
    ...(typeof value.title === "string" || value.title === null ? { title: value.title } : {}),
    ...(value.status !== undefined
      ? { status: value.status === null ? null : integer(value.status) }
      : legacyDomain
        ? { status: statusCode }
        : {}),
    ...(typeof value.detail === "string" || value.detail === null
      ? { detail: value.detail }
      : legacyDomain && typeof value.message === "string"
        ? { detail: value.message }
        : {}),
    ...(typeof value.instance === "string" || value.instance === null ? { instance: value.instance } : {}),
    ...(apiDiagnosticId(value.requestId) ? { requestId: apiDiagnosticId(value.requestId) } : {}),
    ...(apiDiagnosticId(value.traceId) ? { traceId: apiDiagnosticId(value.traceId) } : {}),
    ...(integer(value.errorCode) !== undefined ? { errorCode: integer(value.errorCode) } : {}),
    ...(value.data === null
      ? { data: null }
      : recruitmentData(value.data)
        ? { data: recruitmentData(value.data) }
        : {}),
    ...(isRecord(value.errors) ? { errors } : {}),
  };
}

/** Preserves the existing string error contract without ever stringifying a transport exception. */
function serializeErrorBody(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  if (typeof value === "string") return value;
  try {
    return JSON.stringify(value);
  } catch {
    return undefined;
  }
}
