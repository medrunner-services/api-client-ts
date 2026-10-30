import type { WireComponents } from "../../../../contracts/ApiContract";

/** Omit expirationDate, or set it to null, for a non-expiring API token. */
type CreateApiTokenRequest = Omit<WireComponents["schemas"]["CreateApiTokenRequest"], "expirationDate"> & {
  expirationDate?: Date | string | null;
};
export default CreateApiTokenRequest;
