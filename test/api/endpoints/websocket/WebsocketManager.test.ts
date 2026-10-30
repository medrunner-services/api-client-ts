import { describe, expect, it, vi } from "vitest";

const signalr = vi.hoisted(() => {
  const captures: { urlOptions?: unknown } = {};
  const handlers = new Map<string, ((...args: unknown[]) => void)[]>();

  class HubConnectionBuilder {
    public withAutomaticReconnect(): this {
      return this;
    }

    public withUrl(_url: string, options: unknown): this {
      captures.urlOptions = options;
      return this;
    }

    public configureLogging(): this {
      return this;
    }

    public build(): object {
      handlers.clear();
      return {
        on: (name: string, handler: (...args: unknown[]) => void): void => {
          const key = name.toLowerCase();
          handlers.set(key, [...(handlers.get(key) ?? []), handler]);
        },
        off: (name: string, handler?: (...args: unknown[]) => void): void => {
          const key = name.toLowerCase();
          if (handler === undefined) handlers.delete(key);
          else
            handlers.set(
              key,
              (handlers.get(key) ?? []).filter(existing => existing !== handler),
            );
        },
      };
    }
  }

  return { captures, handlers, HubConnectionBuilder };
});

vi.mock("@microsoft/signalr", () => ({
  HubConnectionBuilder: signalr.HubConnectionBuilder,
  LogLevel: {
    Trace: 0,
    Debug: 1,
    Information: 2,
    Warning: 3,
    Error: 4,
    Critical: 5,
  },
}));

import type ApiConfig from "../../../../src/api/ApiConfig";
import DefaultApiConfig from "../../../../src/api/endpoints/DefaultApiConfig";
import TokenManager from "../../../../src/api/endpoints/auth/TokenManager";
import WebsocketManager from "../../../../src/api/endpoints/websocket/WebsocketManager";

describe("WebsocketManager", () => {
  it("obtains its SignalR token through TokenManager", async () => {
    const provider = {
      getAccessToken: vi.fn().mockResolvedValue("oidc-token"),
      invalidate: vi.fn(),
    };
    const config = new DefaultApiConfig({ accessTokenProvider: provider } as ApiConfig);
    const manager = new WebsocketManager(config, new TokenManager(config));

    await manager.establishConnection();

    const options = signalr.captures.urlOptions as { accessTokenFactory(): Promise<string> };
    await expect(options.accessTokenFactory()).resolves.toBe("oidc-token");
  });
});

it("validates SignalR messages before callbacks and preserves unsubscribe identity", async () => {
  const config = new DefaultApiConfig({ accessToken: "fixture" });
  const logger = { trace: vi.fn(), debug: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
  const connection = await new WebsocketManager(config, new TokenManager(config), logger).establishConnection();
  const handler = vi.fn();
  connection.on("EmergencyUpdate", handler);
  connection.on("emergencyupdate", handler);
  expect(signalr.handlers.get("emergencyupdate")).toHaveLength(1);
  signalr.handlers.get("emergencyupdate")?.[0]({ id: 123 });
  expect(handler).not.toHaveBeenCalled();
  expect(logger.error).toHaveBeenCalledOnce();
  signalr.handlers.get("emergencyupdate")?.[0]({ id: "fixture" });
  expect(handler).toHaveBeenCalledExactlyOnceWith({ id: "fixture" });
  connection.off("EmergencyUpdate", handler);
  expect(signalr.handlers.get("emergencyupdate")).toHaveLength(0);
});
