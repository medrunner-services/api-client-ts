import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import PromotionalCode from "../../../models/PromotionalCode";
import ApiResponse from "../../ApiResponse";
import PaginatedResponse from "../../PaginatedResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";

/**
 * Endpoints for interacting with promotional codes.
 * */
export default class CodeEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "code";
  }

  /**
   * Gets the redeemed codes for the current user.
   *
   * @param limit - The number of codes to get, max 100
   * @param paginationToken - The string to use for pagination
   * */
  public async getRedeemedCodes(
    limit: number,
    paginationToken?: string,
  ): Promise<ApiResponse<PaginatedResponse<PromotionalCode>>> {
    return await this.getRequest<PaginatedResponse<PromotionalCode>>("/redeemed", {
      limit,
      paginationToken,
    });
  }

  /**
   * Redeems the specified promotional code for the current user
   *
   * @param code - The code to redeem.
   * */
  public async redeem(code: string): Promise<ApiResponse> {
    return await this.postRequest(`/redeem/${code}`);
  }
}
