import { type HubConnection, HubConnectionBuilder, ILogger, LogLevel } from "@microsoft/signalr";
import { Logger } from "ts-log";

import { parseEvent } from "../../../contracts/ApiContract";
import TokenManager from "../auth/TokenManager";
import DefaultApiConfig from "../DefaultApiConfig";

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
    private readonly config: DefaultApiConfig,
    tokenManager: TokenManager,
    logger?: Logger,
  ) {
    this.tokenManager = tokenManager;
    this.logger = logger;
  }

  public async establishConnection(): Promise<HubConnection> {
    const connection = new HubConnectionBuilder()
      .withAutomaticReconnect({
        nextRetryDelayInMilliseconds: retryContext => {
          if (retryContext.previousRetryCount >= 10) return null;
          return Math.min(500 * Math.pow(2, retryContext.previousRetryCount), 5000);
        },
      })
      .withUrl(`${this.config.baseUrl}/hub/emergency`, {
        withCredentials: this.config.cookieAuth,

        accessTokenFactory: async (): Promise<string> =>
          (await this.tokenManager.getAccessToken("WS accessTokenFactory")) ?? "",
      })
      .configureLogging(new WSLogger(this.logger))
      .build();
    const originalOn = connection.on.bind(connection);
    const originalOff = connection.off.bind(connection);
    const wrappers = new Map<string, Map<(...args: unknown[]) => void, (...args: unknown[]) => void>>();
    connection.on = (methodName, handler): void => {
      const name = methodName.toLowerCase();
      const known =
        /^(emergency|team|person|chatmessage|orgsettings)(create|update|delete)$/.test(name) ||
        name === "deploymentcreate";
      if (!known) {
        originalOn(methodName, handler);
        return;
      }
      let handlers = wrappers.get(name);
      if (handlers === undefined) {
        handlers = new Map();
        wrappers.set(name, handlers);
      }
      if (handlers.has(handler)) return;
      const wrapper = (...args: unknown[]): void => {
        try {
          parseEvent(name === "deploymentcreate" ? "Deployment" : "FannedContent", args[0]);
        } catch (error) {
          this.logger?.error(error instanceof Error ? error.message : "Invalid SignalR event");
          return;
        }
        handler(...args);
      };
      handlers.set(handler, wrapper);
      originalOn(methodName, wrapper);
    };
    connection.off = (methodName, handler?): void => {
      const name = methodName.toLowerCase();
      if (handler === undefined) {
        wrappers.delete(name);
        originalOff(methodName);
        return;
      }
      const wrapper = wrappers.get(name)?.get(handler);
      wrappers.get(name)?.delete(handler);
      originalOff(methodName, wrapper ?? handler);
    };
    return connection;
  }
}
