import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ApiResponse from "../../ApiResponse";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";
import MedalInformation from "./response/MedalInformation";

/**
 * Endpoints for interacting with staff.
 * */
export default class StaffEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  protected override endpoint(): string {
    return "staff";
  }

  /**
   * Gets detailed information about medals.
   * */
  public async medalsInformation(): Promise<ApiResponse<MedalInformation[]>> {
    return await this.getRequest<MedalInformation[]>("/meta/medals");
  }
}
