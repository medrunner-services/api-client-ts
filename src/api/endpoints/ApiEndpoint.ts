import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { Logger } from "ts-log";

import { HeaderProvider } from "../../Func";
import { DefaultApiConfig } from "../ApiConfig";
import ApiResponse from "../ApiResponse";
import TokenManager from "./auth/TokenManager";

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
        if (accessToken !== undefined || !this.config.cookieAuth) {
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
      const config = await this.headersForRequest(noAuthentication);
      if (queryParams !== undefined) {
        config.params = queryParams;
      }

      const result = await request(requestUrl, config);

      return {
        success: true,
        data: result.data,
      };
    } catch (e) {
      this.log?.warn(`Error for ${requestType} request to ${requestUrl}: ${e}`);
      return {
        success: false,
        errorMessage: e instanceof AxiosError ? e.response?.data : undefined,
        statusCode: e instanceof AxiosError ? e.response?.status : undefined,
      };
    }
  }
}

type AxiosWrapper<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<ApiResponse<T>>;

type AxiosRequestWithBody<T = unknown> = (
  url: string,
  data: unknown,
  config: AxiosRequestConfig,
) => Promise<ApiResponse<T>>;
type AxiosRequestWithoutBody<T = unknown> = (url: string, config: AxiosRequestConfig) => Promise<ApiResponse<T>>;
