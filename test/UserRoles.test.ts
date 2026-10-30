import { describe, expect, it } from "vitest";

import { UserRoles } from "../src/models/Person";

describe("UserRoles", () => {
  it("preserves the API's high-bit authorization flags", () => {
    expect(UserRoles.CEO).toBe(2 ** 50);
    expect(UserRoles.DEVELOPER).toBe(2 ** 51);
    expect(UserRoles.BOT).toBe(2 ** 52);
  });
});
