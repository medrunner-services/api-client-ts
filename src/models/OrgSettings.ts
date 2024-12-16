export default interface OrgSettings {
  status: ServiceStatus;
  emergenciesEnabled: boolean;
  messageOfTheDay: MessageOfTheDay;
}

export interface MessageOfTheDay {
  message: string;
  dateRange: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export enum ServiceStatus {
  HEALTHY = 0,
  DEGRADED = 1,
  OUTAGE = 2,
  OFFLINE = 3,
  UNKNOWN = 4,
}
