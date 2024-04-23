import { type HubConnection, HubConnectionBuilder, ILogger, LogLevel } from "@microsoft/signalr";
import { Logger } from "ts-log";

import TokenManager from "../auth/TokenManager";

class WSLogger implements ILogger {
  constructor(private logger?: Logger) {}

  log(logLevel: LogLevel, message: string): void {
    switch (logLevel) {
      case LogLevel.Trace:
        this.logger?.trace(`Websocket: ${message}`);
        break;
      case LogLevel.Information:
        this.logger?.info(`Websocket: ${message}`);
        break;
      case LogLevel.Warning:
        this.logger?.warn(`Websocket: ${message}`);
        break;
      case LogLevel.Error || LogLevel.Critical:
        this.logger?.error(`Websocket: ${message}`);
        break;
      case LogLevel.Debug:
        this.logger?.debug(`Websocket: ${message}`);
        break;
    }
  }
}

export default class WebsocketManager {
  private tokenManager: TokenManager;
  protected readonly logger?: Logger;

  public constructor(
    private readonly baseUrl: string,
    tokenManager: TokenManager,
    logger?: Logger,
  ) {
    this.tokenManager = tokenManager;
    this.logger = logger;
  }

  public async establishConnection(): Promise<HubConnection> {
    return new HubConnectionBuilder()
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => (retryContext.previousRetryCount > 5 ? null : 2000),
      })
      .withUrl(`${this.baseUrl}/hub/emergency`, {
        accessTokenFactory: async () => (await this.tokenManager.getAccessToken()) ?? "",
      })
      .configureLogging(new WSLogger(this.logger))
      .build();
  }
}
