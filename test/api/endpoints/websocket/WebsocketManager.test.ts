import { describe, expect, it, vi } from "vitest";

const signalr = vi.hoisted(() => {
  const captures: { urlOptions?: unknown } = {};

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
      return {};
    }
  }

  return { captures, HubConnectionBuilder };
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
