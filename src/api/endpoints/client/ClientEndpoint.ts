import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ClientHistory from "../../../models/ClientHistory";
import Person, { BlockedStatus } from "../../../models/Person";
import ApiResponse from "../../ApiResponse";
import PaginatedResponse from "../../PaginatedResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";

/**
 * Endpoints for interacting with clients.
 * */
export default class ClientEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "client";
  }

  /**
   * Gets the current client.
   * */
  public async get(): Promise<ApiResponse<Person>> {
    return await this.getRequest<Person>("");
  }

  /**
   * Gets the specified amount of emergencies the client has created.
   * @param limit - The number of emergencies to get, defaults to 10
   * @param paginationToken - The string to use for pagination
   * */
  public async getHistory(
    limit?: number,
    paginationToken?: string,
  ): Promise<ApiResponse<PaginatedResponse<ClientHistory>>> {
    return await this.getRequest<PaginatedResponse<ClientHistory>>("/history", { limit, paginationToken });
  }

  /**
   * Gets the blocklist status of the current client.
   * */
  public async getBlockedStatus(): Promise<ApiResponse<BlockedStatus>> {
    return await this.getRequest<BlockedStatus>("/blocked");
  }

  /**
   * Links the current user to a rsiHandle.
   *
   * @param rsiHandle - The RSI handle of the client
   * @returns The updated Person object of the client
   *
   * */
  public async linkClient(rsiHandle: string): Promise<ApiResponse<Person>> {
    return await this.postRequest<Person>("/link", { rsiHandle });
  }

  /**
   * Updates the settings of the current user for the Client Portal.
   *
   * @param settings - The stringified object settings to add or update
   *
   * */
  public async setUserSettings(settings: string): Promise<ApiResponse> {
    return await this.putRequest("/settings/clientPortal", { settingsBlob: settings });
  }

  /**
   * Deactivate the current client.
   * */
  public async deactivate(): Promise<ApiResponse> {
    return await this.deleteRequest("");
  }
}
