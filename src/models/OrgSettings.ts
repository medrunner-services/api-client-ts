export default interface OrgSettings {
  status: ServiceStatus;
  emergenciesEnabled: boolean;
  messageOfTheDay?: MessageOfTheDay;
}

export interface MessageOfTheDay {
  message: string;
  dateRange?: DateRange;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export enum ServiceStatus {
  UNKNOWN = 0,
  HEALTHY = 1,
  SLIGHTLY_DEGRADED = 2,
  HEAVILY_DEGRADED = 3,
  OFFLINE = 4,
}
