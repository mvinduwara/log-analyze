import axios from "axios";
import type {
  Analytics,
  PaginatedLogs,
  LogFilter,
  AlertRule,
  AlertEvent,
  UploadResult,
} from "@/types";

const http = axios.create({ baseURL: "/api", timeout: 15000 });

export async function fetchAnalytics(): Promise<Analytics> {
  const { data } = await http.get<Analytics>("/analytics");
  return data;
}

export async function fetchLogs(
  filter: LogFilter,
  page: number,
  pageSize: number
): Promise<PaginatedLogs> {
  const params: Record<string, string | number> = { page, pageSize };
  if (filter.search) params.search = filter.search;
  if (filter.method) params.method = filter.method;
  if (filter.statusMin !== "") params.statusMin = filter.statusMin;
  if (filter.statusMax !== "") params.statusMax = filter.statusMax;
  if (filter.ip) params.ip = filter.ip;
  if (filter.path) params.path = filter.path;
  if (filter.dateFrom) params.dateFrom = filter.dateFrom;
  if (filter.dateTo) params.dateTo = filter.dateTo;
  const { data } = await http.get<PaginatedLogs>("/logs", { params });
  return data;
}

export async function uploadLogFile(file: File): Promise<UploadResult> {
  const form = new FormData();
  form.append("file", file);
  const { data } = await http.post<UploadResult>("/upload", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function fetchAlertRules(): Promise<AlertRule[]> {
  const { data } = await http.get<AlertRule[]>("/alerts/rules");
  return data;
}

export async function createAlertRule(
  rule: Omit<AlertRule, "id" | "createdAt">
): Promise<AlertRule> {
  const { data } = await http.post<AlertRule>("/alerts/rules", rule);
  return data;
}

export async function deleteAlertRule(id: string): Promise<void> {
  await http.delete(`/alerts/rules/${id}`);
}

export async function fetchAlertEvents(): Promise<AlertEvent[]> {
  const { data } = await http.get<AlertEvent[]>("/alerts/events");
  return data;
}

export async function clearLogs(): Promise<void> {
  await http.delete("/logs");
}