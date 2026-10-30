import axios from "axios";
import MockAdapter from "axios-mock-adapter";
import { describe, expect, it } from "vitest";

import { ApiContractError, assertHttpRequest, assertHttpResponse, parseEvent } from "../../src/contracts/ApiContract";
import EmergencyEndpoint from "../../src/api/endpoints/emergency/EmergencyEndpoint";
import DefaultApiConfig from "../../src/api/endpoints/DefaultApiConfig";
import TokenManager from "../../src/api/endpoints/auth/TokenManager";
import fixtures from "../../openapi/fixtures.json";
import events from "../../openapi/events.json";
import document from "../../openapi/openapi.json";

describe("serialized .NET wire contracts", () => {
  for (const name of Object.keys(fixtures) as (keyof typeof fixtures)[]) {
    it(`accepts the actual .NET-serialized ${name} snapshot`, () => {
      expect(() => parseEvent(name, fixtures[name])).not.toThrow();
    });
  }
  it("accepts explicit nulls but rejects missing required nullable fields", () => {
    const missing = { ...fixtures.Emergency } as Record<string, unknown>;
    delete missing.coordinationThread;
    expect(() => parseEvent("Emergency", missing)).toThrow(ApiContractError);
    expect(() => assertHttpResponse("GET", "/emergency/example", 200, missing)).toThrow(ApiContractError);
    expect(() => assertHttpResponse("GET", "/emergency/example", 200, fixtures.Emergency)).not.toThrow();
  });
  it("repairs only absent nullable legacy queue fields, including nested objects", () => {
    const legacy = JSON.parse(
      JSON.stringify(fixtures.Emergency, (_key, value) => (value === null ? undefined : value)),
    );
    const restored = parseEvent("Emergency", legacy, true);
    expect(restored).toEqual(fixtures.Emergency);
    expect(Object.hasOwn(legacy, "coordinationThread")).toBe(false);
    delete legacy.respondingTeam;
    expect(() => parseEvent("Emergency", legacy, true)).toThrow(ApiContractError);
  });
  it("rejects wrong nested types and does not leak values in contract errors", () => {
    const invalid = { ...fixtures.Emergency, coordinationThread: { id: 123, channelId: "private-value" } };
    expect(() => parseEvent("Emergency", invalid, true)).toThrow(ApiContractError);
    try {
      parseEvent("Emergency", invalid);
    } catch (error) {
      expect(String(error)).not.toContain("private-value");
    }
  });
  it("permits additive fields without mutating the input", () => {
    const payload = { ...fixtures.Emergency, futureField: true };
    expect(parseEvent("Emergency", payload)).toBe(payload);
  });
  it("permits omission in partial requests but keeps required creation fields required", () => {
    expect(() => assertHttpRequest("PATCH", "/emergency/example/messages", {})).not.toThrow();
    expect(() => assertHttpRequest("PATCH", "/emergency/example/messages", { coordinationThread: null })).not.toThrow();
    expect(() => assertHttpRequest("POST", "/emergency", {})).toThrow(ApiContractError);
  });
  it("keeps all complete emergency fields required in HTTP and event schemas", () => {
    expect(document.components.schemas.Emergency.required).toEqual(
      expect.arrayContaining(["coordinationThread", "clientMessage", "system"]),
    );
    expect(events.Emergency.required).toEqual(
      expect.arrayContaining(["coordinationThread", "clientMessage", "system"]),
    );
  });
  it("validates realtime invalidations before accepting them", () => {
    expect(parseEvent("FannedContent", { id: "example" })).toEqual({ id: "example" });
    expect(() => parseEvent("FannedContent", {})).toThrow(ApiContractError);
  });
  it("validates a real HTTP endpoint rather than returning malformed success data", async () => {
    const config = new DefaultApiConfig({ accessToken: "fixture" });
    const endpoint = new EmergencyEndpoint(config, new TokenManager(config));
    const mock = new MockAdapter(axios);
    try {
      mock.onGet(`${config.baseUrl}/emergency/example`).reply(200, { id: "example" });
      const response = await endpoint.getEmergency("example");
      expect(response.success).toBe(false);
      expect(response.data).toBeUndefined();
      expect(response.errorMessage).toContain("API contract");
    } finally {
      mock.restore();
    }
  });
});

describe("complete snapshot and request presence regressions", () => {
  for (const name of Object.keys(fixtures) as (keyof typeof fixtures)[]) {
    it(`rejects every missing required ${name} field and restores historical nullable omissions`, () => {
      const required = events[name].required;
      for (const key of required) {
        const missing: Record<string, unknown> = { ...fixtures[name] };
        delete missing[key];
        expect(() => parseEvent(name, missing), `${name}.${key}`).toThrow(ApiContractError);
      }
      const legacy = JSON.parse(JSON.stringify(fixtures[name], (_key, value) => (value === null ? undefined : value)));
      expect(parseEvent(name, legacy, true)).toEqual(fixtures[name]);
    });
  }
  it("restores nested nullable data while preserving a real coordination thread", () => {
    const complete = {
      ...fixtures.Emergency,
      coordinationThread: { id: "thread", channelId: "channel" },
      clientData: {
        rsiHandle: "Fixture",
        rsiProfileLink: "https://example.invalid",
        gotClientData: true,
        reported: false,
        userSid: null,
      },
    };
    const legacy = JSON.parse(JSON.stringify(complete, (_key, value) => (value === null ? undefined : value)));
    expect(parseEvent("Emergency", legacy, true)).toEqual(complete);
    delete legacy.coordinationThread.id;
    expect(() => parseEvent("Emergency", legacy, true)).toThrow(ApiContractError);
  });
  it("distinguishes a required nullable clear command from an omitted value", () => {
    expect(() => assertHttpRequest("PUT", "/orgsettings/public/motd", {})).toThrow(ApiContractError);
    expect(() => assertHttpRequest("PUT", "/orgsettings/public/motd", { message: null })).not.toThrow();
  });
});
