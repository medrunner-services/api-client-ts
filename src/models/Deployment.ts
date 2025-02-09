export default interface Deployment {
  clientType: ClientType;
  version: string;
}

export enum ClientType {
  CLIENT_PORTAL = 1,
  STAFF_PORTAL = 2,
}
