import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import qs from "qs";
import { Logger } from "ts-log";

import { HeaderProvider } from "../../Func";
import ProblemDetails from "../../models/ProblemDetails";
import { ApiRequestFailure, ApiRequestFailureLogger, ApiRequestMethod } from "../ApiRequestFailureLogger";
import ApiResponse from "../ApiResponse";
import ApiRequestTelemetry from "../telemetry/ApiRequestTelemetry";
import TokenManager from "./auth/TokenManager";
import DefaultApiConfig from "./DefaultApiConfig";

const maxStructuredResponseBodyLength = 16 * 1024;
const utf8Encoder = new TextEncoder();

export default abstract class ApiEndpoint {
  public readonly config: DefaultApiConfig;

  protected constructor(
    config: DefaultApiConfig,
    public readonly tokenManager: TokenManager,
    protected readonly log?: Logger,
    private readonly headerProvider?: HeaderProvider,
  ) {
    this.config = config;
  }

  protected abstract endpoint(): string;

  protected endpointUrl(): string {
    return `${this.config.baseUrl}/${this.endpoint()}`;
  }

  private async headersForRequest(noAuthentication: boolean): Promise<AxiosRequestConfig> {
    const config: AxiosRequestConfig = {
      baseURL: this.config.baseUrl,
      headers: {},
      withCredentials: this.config.cookieAuth,
    };

    if (config.headers !== undefined) {
      if (!noAuthentication) {
        const accessToken = await this.tokenManager.getAccessToken("API makeRequest");
        if (accessToken !== undefined) {
          // only include auth header if we have a token
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
      }

      if (this.headerProvider !== undefined) {
        for (const header of Object.entries(await this.headerProvider())) {
          config.headers[header[0]] = header[1];
        }
      }
    }

    return config;
  }

  protected async getRequest<T = unknown>(
    endpoint: string,
    queryParams?: { [key: string]: unknown },
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    return await this.makeRequestWithoutBody<T>(endpoint, "GET", axios.get, queryParams, noAuthentication);
  }

  protected async postRequest<T = unknown>(
    endpoint: string,
    data?: unknown,
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    return await this.makeRequestWithBody<T>(endpoint, "POST", axios.post, data, noAuthentication);
  }

  protected async putRequest<T = unknown>(
    endpoint: string,
    data?: unknown,
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    return await this.makeRequestWithBody<T>(endpoint, "PUT", axios.put, data, noAuthentication);
  }

  protected async patchRequest<T = unknown>(
    endpoint: string,
    data?: unknown,
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    return await this.makeRequestWithBody<T>(endpoint, "PATCH", axios.patch, data, noAuthentication);
  }

  protected async deleteRequest(
    endpoint: string,
    queryParams?: { [key: string]: unknown },
    noAuthentication?: boolean,
  ): Promise<ApiResponse> {
    return await this.makeRequestWithoutBody(endpoint, "DELETE", axios.delete, queryParams, noAuthentication);
  }

  private async makeRequestWithBody<T = unknown>(
    endpoint: string,
    requestType: Extract<ApiRequestMethod, "POST" | "PUT" | "PATCH">,
    axiosRequest: AxiosRequestWithBody<T>,
    data?: unknown,
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    const wrappedRequest: AxiosWrapper<T> = async (requestUrl, config) => await axiosRequest(requestUrl, data, config);
    return await this.makeRequest<T>(endpoint, requestType, wrappedRequest, undefined, noAuthentication);
  }

  private async makeRequestWithoutBody<T = unknown>(
    endpoint: string,
    requestType: Extract<ApiRequestMethod, "GET" | "DELETE">,
    axiosRequest: AxiosRequestWithoutBody<T>,
    queryParams?: { [key: string]: unknown },
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    const wrappedRequest: AxiosWrapper<T> = async (requestUrl, config) => await axiosRequest(requestUrl, config);
    return await this.makeRequest<T>(endpoint, requestType, wrappedRequest, queryParams, noAuthentication);
  }

  private buildUrl(endpoint: string): string {
    const baseUrl = this.endpointUrl();

    if (baseUrl.endsWith("/")) {
      if (endpoint.startsWith("/")) {
        return `${baseUrl}${endpoint.substring(1)}`;
      }

      return `${baseUrl}${endpoint}`;
    }

    if (endpoint.startsWith("/")) {
      return `${baseUrl}${endpoint}`;
    }

    return `${baseUrl}/${endpoint}`;
  }

  private async makeRequest<T = unknown>(
    endpoint: string,
    requestType: ApiRequestMethod,
    request: AxiosWrapper<T>,
    queryParams?: { [key: string]: unknown },
    noAuthentication = false,
  ): Promise<ApiResponse<T>> {
    const requestUrl = this.buildUrl(endpoint);
    const target = requestTarget(requestUrl);
    const telemetry = new ApiRequestTelemetry({
      endpoint: this.constructor.name,
      method: requestType,
      serverAddress: target?.hostname,
    });

    return await telemetry.run(async () => {
      this.log?.debug(`sending ${requestType} request to ${requestUrl}`);
      try {
        const result = await request(requestUrl, await this.requestConfig(noAuthentication, queryParams));
        telemetry.recordSuccess(result.status);

        return {
          success: true,
          data: result.data,
        };
      } catch (error) {
        if (this.shouldRetryAuthenticationFailure(error, noAuthentication)) {
          this.tokenManager.invalidateAccessToken();
          telemetry.recordAuthenticationRetry();

          try {
            const result = await request(requestUrl, await this.requestConfig(noAuthentication, queryParams));
            telemetry.recordSuccess(result.status);
            return {
              success: true,
              data: result.data,
            };
          } catch (retryError) {
            return this.reportRequestFailure<T>(requestType, requestUrl, retryError, telemetry);
          }
        }

        return this.reportRequestFailure<T>(requestType, requestUrl, error, telemetry);
      } finally {
        telemetry.end();
      }
    });
  }

  private async requestConfig(
    noAuthentication: boolean,
    queryParams?: { [key: string]: unknown },
  ): Promise<AxiosRequestConfig> {
    const config = await this.headersForRequest(noAuthentication);
    if (queryParams !== undefined) {
      config.params = queryParams;
      config.paramsSerializer = (params): string => {
        return qs.stringify(params, { arrayFormat: "repeat" });
      };
    }

    return config;
  }

  private shouldRetryAuthenticationFailure(error: unknown, noAuthentication: boolean): boolean {
    return (
      !noAuthentication &&
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      (this.config.accessTokenProvider !== undefined ||
        this.config.cookieAuth ||
        this.config.accessToken !== undefined ||
        this.config.refreshToken !== undefined)
    );
  }

  /** Logs terminal HTTP failures without exposing request headers or request payloads. */
  private reportRequestFailure<T>(
    requestType: ApiRequestMethod,
    requestUrl: string,
    error: unknown,
    telemetry: ApiRequestTelemetry,
  ): ApiResponse<T> {
    const response = this.errorResponse<T>(error);
    const failure = createApiRequestFailure(
      this.constructor.name,
      requestType,
      requestUrl,
      response,
      telemetry.getRetryCount(),
    );
    telemetry.recordFailure(failure);

    if (isApiRequestFailureLogger(this.log)) {
      this.log.logApiRequestFailure(failure);
      return response;
    }

    const message = `API request failed: ${requestType} ${requestUrl}; status=${response.statusCode ?? "unavailable"}; response=${
      failure.responseBody ?? "unavailable"
    }${failure.responseBodyTruncated ? " [truncated]" : ""}`;

    if (response.statusCode === undefined || response.statusCode >= 500) {
      this.log?.error(message);
    } else {
      this.log?.warn(message);
    }

    return response;
  }

  private errorResponse<T>(error: unknown): ApiResponse<T> {
    const errorData = axios.isAxiosError(error) ? error.response?.data : undefined;

    return {
      success: false,
      errorMessage: serializeErrorBody(errorData),
      statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
      problemDetails: isProblemDetails(errorData) ? errorData : undefined,
    };
  }
}

/** Renders transport response content for an inspectable log message and the string API response contract. */
function serializeErrorBody(errorData: unknown): string | undefined {
  if (errorData === undefined) {
    return undefined;
  }

  if (typeof errorData === "string") {
    return errorData;
  }

  try {
    return JSON.stringify(errorData);
  } catch {
    return String(errorData);
  }
}

/** Identifies error bodies which can safely be exposed through the typed Problem Details contract. */
function isProblemDetails(value: unknown): value is ProblemDetails {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }

  const details = value as Record<string, unknown>;
  const hasProblemDetailsField = ["type", "title", "status", "detail", "instance"].some(field => field in details);

  return (
    hasProblemDetailsField &&
    isNullableString(details.type) &&
    isNullableString(details.title) &&
    isProblemDetailsStatus(details.status) &&
    isNullableString(details.detail) &&
    isNullableString(details.instance)
  );
}

/** Validates optional fields whose OpenAPI schema permits either a string or null. */
function isNullableString(value: unknown): boolean {
  return value === undefined || value === null || typeof value === "string";
}

/** Validates the API schema's optional integer-or-string status value. */
function isProblemDetailsStatus(value: unknown): boolean {
  return (
    value === undefined ||
    value === null ||
    (typeof value === "number" && Number.isInteger(value)) ||
    (typeof value === "string" && /^-?(?:0|[1-9]\d*)$/.test(value))
  );
}

/** Converts a terminal response into a bounded, header-free structured logging record. */
function createApiRequestFailure(
  endpoint: string,
  method: ApiRequestMethod,
  requestUrl: string,
  response: ApiResponse,
  retryCount: number,
): ApiRequestFailure {
  const target = requestTarget(requestUrl);
  const responseBody = truncateResponseBody(response.errorMessage);

  return {
    endpoint,
    method,
    serverAddress: target?.hostname,
    path: target?.pathname,
    statusCode: response.statusCode,
    retryCount,
    errorType: response.problemDetails?.type || (response.statusCode === undefined ? "transport" : "http.response"),
    responseBody: responseBody.value,
    responseBodyTruncated: responseBody.truncated,
    problemDetails: response.problemDetails,
  };
}

/** Limits structured response logging by UTF-8 bytes while preserving complete Unicode characters. */
function truncateResponseBody(responseBody: string | undefined): { value?: string; truncated: boolean } {
  if (responseBody === undefined || utf8Encoder.encode(responseBody).length <= maxStructuredResponseBodyLength) {
    return { value: responseBody, truncated: false };
  }

  let encodedLength = 0;
  const characters: string[] = [];
  for (const character of responseBody) {
    const characterLength = utf8Encoder.encode(character).length;
    if (encodedLength + characterLength > maxStructuredResponseBodyLength) {
      break;
    }

    characters.push(character);
    encodedLength += characterLength;
  }

  return { value: characters.join(""), truncated: true };
}

/** Parses only the non-sensitive host and path components needed by structured logs. */
function requestTarget(requestUrl: string): URL | undefined {
  try {
    return new URL(requestUrl);
  } catch {
    return undefined;
  }
}

/** Detects an additive structured failure logging capability without changing the ts-log logger contract. */
function isApiRequestFailureLogger(logger: Logger | undefined): logger is Logger & ApiRequestFailureLogger {
  return typeof (logger as Partial<ApiRequestFailureLogger> | undefined)?.logApiRequestFailure === "function";
}

type AxiosWrapper<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;

type AxiosRequestWithBody<T = unknown> = (
  url: string,
  data: unknown,
  config: AxiosRequestConfig,
) => Promise<AxiosResponse<T>>;
type AxiosRequestWithoutBody<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<AxiosResponse<T>>;
