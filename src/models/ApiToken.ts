import type { WireComponents } from "../contracts/ApiContract";
type ApiToken = WireComponents["schemas"]["ApiToken"];
export default ApiToken;

export enum TokenVersion {
  UNKNOWN = -1,
  LEGACY = 0,
  V3 = 3,
  V4 = 4,
}

export enum TokenScope {
  CLIENT_READ = "client:read",
  CLIENT_WRITE = "client:write",
  CLIENT_PROFILE_READ = "client:profile:read",
  CLIENT_PROFILE_WRITE = "client:profile:write",
  CLIENT_ORGSETTINGS_READ = "client:orgsettings:read",
  STAFF_READ = "staff:read",
  STAFF_WRITE = "staff:write",
  STAFF_PROFILE_READ = "staff:profile:read",
  STAFF_PROFILE_WRITE = "staff:profile:write",
  STAFF_ORGSETTINGS_READ = "staff:orgsettings:read",
}
