import { describe, expect, it } from "vitest";

import type { WireComponents } from "../../src/contracts/ApiContract";
import { ApiContractError, assertHttpRequest, assertHttpResponse } from "../../src/contracts/ApiContract";

const integrationFields = ["discordCategoryId", "discordRoleId", "musterPointId"] as const;

function staffSettings(): WireComponents["schemas"]["StaffSettings"] {
  return {
    messageOfTheDay: null,
    beaconsEnabled: true,
    certifications: { basicCertificationEnabled: true },
    shipSettings: { ships: [] },
    unitSettings: {
      units: [
        {
          unitName: "Fixture unit",
          primarySystems: [],
          secondarySystems: [],
          discordCategoryId: null,
          discordRoleId: null,
          musterPointId: null,
        },
      ],
    },
    training: { registrationCutoffWindowMinutes: 30 },
    team: {
      alertMaxSize: 6,
      beaconMaxSize: 6,
      trainingMaxSize: 6,
      enforceHardCap: false,
      requiredCertifications: {},
      enforceTeams: false,
      autoAdjustOrderOnAlertCompletion: false,
    },
  };
}

describe("normalized organization unit responses", () => {
  it("accepts units whose optional integration IDs are explicitly null", () => {
    const settings = staffSettings();
    expect(() => assertHttpResponse("GET", "/OrgSettings/staff", 200, settings)).not.toThrow();
    expect(settings.unitSettings.units[0].discordCategoryId).toBeNull();
  });

  it("accepts configured string IDs", () => {
    const settings = staffSettings();
    const unit: Record<string, unknown> = settings.unitSettings.units[0];
    for (const field of integrationFields) unit[field] = "fixture-id";
    expect(() => assertHttpResponse("GET", "/OrgSettings/staff", 200, settings)).not.toThrow();
  });

  for (const field of integrationFields) {
    it(`keeps ${field} required in complete responses`, () => {
      const settings = staffSettings();
      const unit: Record<string, unknown> = settings.unitSettings.units[0];
      delete unit[field];
      expect(() => assertHttpResponse("GET", "/OrgSettings/staff", 200, settings)).toThrow(
        new ApiContractError("GET /OrgSettings/staff", `/unitSettings/units/0/${field}`, "required"),
      );
    });

    it(`rejects non-string, non-null ${field} values`, () => {
      const settings = staffSettings();
      const unit: Record<string, unknown> = settings.unitSettings.units[0];
      unit[field] = 123;
      expect(() => assertHttpResponse("GET", "/OrgSettings/staff", 200, settings)).toThrow(
        new ApiContractError("GET /OrgSettings/staff", `/unitSettings/units/0/${field}`, "type"),
      );
    });
  }

  it("preserves the separate non-null update request contract", () => {
    const unit = {
      name: "Fixture unit",
      primarySystemIds: [],
      secondarySystemIds: [],
      discordCategoryId: "category",
      discordRoleId: "role",
      musterPointId: "location",
    };
    expect(() => assertHttpRequest("PUT", "/OrgSettings/staff/units", { units: [unit] })).not.toThrow();
    for (const field of integrationFields) {
      expect(() =>
        assertHttpRequest("PUT", "/OrgSettings/staff/units", { units: [{ ...unit, [field]: null }] }),
      ).toThrow(ApiContractError);
    }
  });
});
