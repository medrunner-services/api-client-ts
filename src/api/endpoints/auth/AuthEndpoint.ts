import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ApiToken from "../../../models/ApiToken";
import ApiResponse from "../../ApiResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";
import CreateApiTokenRequest from "./request/CreateApiTokenRequest";
import SignOutRequest from "./request/SignOutRequest";

/**
 * Endpoints for interacting with auth.
 * */
export default class AuthEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "auth";
  }

  /**
   * Invalidate a refresh token.
   *
   * @param oldToken - Token to be invalidated
   *
   * @virtual
   * */
  public async signOut(oldToken: SignOutRequest): Promise<ApiResponse> {
    return await this.postRequest<string>("/signOut", oldToken);
  }

  /**
   * Gets all api tokens for the user.
   *
   * */
  public async getApiTokens(): Promise<ApiResponse<ApiToken[]>> {
    return await this.getRequest<ApiToken[]>(`/apiTokens`);
  }

  /**
   * Creates an api token.
   *
   * @param newToken - Emergency details for the new emergency
   * @returns The newly-created api token
   *
   * @virtual
   * */
  public async createApiToken(newToken: CreateApiTokenRequest): Promise<ApiResponse<string>> {
    return await this.postRequest<string>("/apiTokens", {
      name: newToken.name,
      expirationDate: newToken.expirationDate?.toISOString(),
    });
  }

  /**
   * Delete an api token.
   *
   * @param id - The id of the api token to delete
   *
   * */
  public async deleteApiToken(id: string): Promise<ApiResponse> {
    return await this.deleteRequest(`/apiTokens/${id}`);
  }
}
