export interface LogEntry {
  id: string;
  ip: string;
  timestamp: string;
  method: string;
  path: string;
  protocol: string;
  status: number;
  size: number;
  referrer: string;
  userAgent: string;
  responseTime?: number;
  raw: string;
}

export interface Analytics {
  totalRequests: number;
  errorRate: number;
  uniqueIps: number;
  avgResponseTime: number;
  requestsPerMinute: TimePoint[];
  statusDistribution: StatusCount[];
  topEndpoints: EndpointStat[];
  topIps: IpStat[];
}

export interface TimePoint {
  time: string;
  requests: number;
  errors: number;
}

export interface StatusCount {
  name: string;
  value: number;
  code: string;
}

export interface EndpointStat {
  path: string;
  count: number;
  errorCount: number;
  avgTime: number;
}

export interface IpStat {
  ip: string;
  count: number;
  lastSeen: string;
}

export interface AlertRule {
  id: string;
  name: string;
  metric: "errorRate" | "responseTime" | "requestRate";
  operator: "gt" | "lt";
  threshold: number;
  enabled: boolean;
  createdAt: string;
}

export interface AlertEvent {
  id: string;
  ruleId: string;
  ruleName: string;
  metric: string;
  value: number;
  threshold: number;
  triggeredAt: string;
}

export interface LogFilter {
  search: string;
  method: string;
  statusMin: number | "";
  statusMax: number | "";
  ip: string;
  path: string;
  dateFrom: string;
  dateTo: string;
}

export interface PaginatedLogs {
  data: LogEntry[];
  total: number;
  page: number;
  pageSize: number;
}

export interface UploadResult {
  parsed: number;
  failed: number;
  filename: string;
}

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}