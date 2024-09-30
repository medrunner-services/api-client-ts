import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ApiResponse from "../../ApiResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";

/**
 * Endpoints for interacting with promotional codes.
 * */
export default class CodeEndpoint extends ApiEndpoint {
  constructor(baseUrl: string | undefined, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(baseUrl, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "code";
  }

  /**
   * Gets the specified amount of chat messages for a given emergency.
   *
   * @param code - The code to redeem.
   * */
  public async redeem(code: string): Promise<ApiResponse> {
    return await this.postRequest(`/redeem/${code}`);
  }
}
