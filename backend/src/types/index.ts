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