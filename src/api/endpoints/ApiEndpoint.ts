import axios, { AxiosRequestConfig } from "axios";
import qs from "qs";
import { Logger } from "ts-log";

import { HeaderProvider } from "../../Func";
import ApiResponse from "../ApiResponse";
import TokenManager from "./auth/TokenManager";
import DefaultApiConfig from "./DefaultApiConfig";

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
    requestType: "POST" | "PUT" | "PATCH",
    axiosRequest: AxiosRequestWithBody<T>,
    data?: unknown,
    noAuthentication?: boolean,
  ): Promise<ApiResponse<T>> {
    const wrappedRequest: AxiosWrapper<T> = async (requestUrl, config) => await axiosRequest(requestUrl, data, config);
    return await this.makeRequest<T>(endpoint, requestType, wrappedRequest, undefined, noAuthentication);
  }

  private async makeRequestWithoutBody<T = unknown>(
    endpoint: string,
    requestType: "GET" | "DELETE",
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
    requestType: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    request: AxiosWrapper<T>,
    queryParams?: { [key: string]: unknown },
    noAuthentication = false,
  ): Promise<ApiResponse<T>> {
    const requestUrl = this.buildUrl(endpoint);

    this.log?.debug(`sending ${requestType} request to ${requestUrl}`);
    try {
      const result = await request(requestUrl, await this.requestConfig(noAuthentication, queryParams));

      return {
        success: true,
        data: result.data,
      };
    } catch (error) {
      if (this.shouldRetryAuthenticationFailure(error, noAuthentication)) {
        this.tokenManager.invalidateAccessToken();

        try {
          const result = await request(requestUrl, await this.requestConfig(noAuthentication, queryParams));
          return {
            success: true,
            data: result.data,
          };
        } catch (retryError) {
          this.log?.warn(`Error for retried ${requestType} request to ${requestUrl}: ${retryError}`);
          return this.errorResponse<T>(retryError);
        }
      }

      this.log?.warn(`Error for ${requestType} request to ${requestUrl}: ${error}`);
      return this.errorResponse<T>(error);
    }
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

  private errorResponse<T>(error: unknown): ApiResponse<T> {
    return {
      success: false,
      errorMessage: axios.isAxiosError(error) ? error.response?.data : undefined,
      statusCode: axios.isAxiosError(error) ? error.response?.status : undefined,
    };
  }
}

type AxiosWrapper<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<ApiResponse<T>>;

type AxiosRequestWithBody<T = unknown> = (
  url: string,
  data: unknown,
  config: AxiosRequestConfig,
) => Promise<ApiResponse<T>>;
type AxiosRequestWithoutBody<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<ApiResponse<T>>;
