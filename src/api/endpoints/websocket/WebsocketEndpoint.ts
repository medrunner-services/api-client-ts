import { HubConnection } from "@microsoft/signalr";
import { Logger } from "ts-log";

import { HeaderProvider } from "../../../Func";
import ApiEndpoint from "../ApiEndpoint";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";
import WebsocketManager from ".//WebsocketManager";

/**
 * Endpoints for interacting with emergencies.
 * */
export default class WebsocketEndpoint extends ApiEndpoint {
  constructor(config: DefaultApiConfig, tokenManager: TokenManager, log?: Logger, headerProvider?: HeaderProvider) {
    super(config, tokenManager, log, headerProvider);
  }

  private websocketManager = new WebsocketManager(this.config, this.tokenManager, this.log);

  protected override endpoint(): string {
    return "websocket";
  }

  /**
   * Gets realtime updates.
   *
   * */
  public async initialize(): Promise<HubConnection> {
    if (this.websocketManager === undefined) {
      throw new Error("WebsocketManager is undefined");
    }
    return await this.websocketManager.establishConnection();
  }
}
