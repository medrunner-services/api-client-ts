import { type HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

import TokenManager from "../auth/TokenManager";

export default class WebsocketManager {
  private tokenManager: TokenManager;
  public constructor(private readonly baseUrl: string, tokenManager: TokenManager) {
    this.tokenManager = tokenManager;
  }

  public async establishConnection(): Promise<HubConnection> {
    return new HubConnectionBuilder()
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => (retryContext.previousRetryCount > 5 ? null : 2000),
      })
      .withUrl(`${this.baseUrl}/hub/emergency`, {
        accessTokenFactory: async () => (await this.tokenManager.getAccessToken()) ?? "",
      })
      .configureLogging(LogLevel.None)
      .build();
  }
}
