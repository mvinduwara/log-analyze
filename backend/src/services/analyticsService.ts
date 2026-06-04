import { logService } from "./logService";
import type { LogEntry } from "../types";

function bucketByMinute(entries: LogEntry[]): { time: string; requests: number; errors: number }[] {
  const map = new Map<string, { requests: number; errors: number }>();

  for (const e of entries) {
    const d = new Date(e.timestamp);
    const key = `${d.getUTCHours().toString().padStart(2, "0")}:${d.getUTCMinutes().toString().padStart(2, "0")}`;
    const bucket = map.get(key) ?? { requests: 0, errors: 0 };
    bucket.requests++;
    if (e.status >= 400) bucket.errors++;
    map.set(key, bucket);
  }

  return Array.from(map.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-30)
    .map(([time, v]) => ({ time, ...v }));
}

function statusDistribution(entries: LogEntry[]) {
  const counts = { "2xx": 0, "3xx": 0, "4xx": 0, "5xx": 0 };
  for (const e of entries) {
    if (e.status >= 500) counts["5xx"]++;
    else if (e.status >= 400) counts["4xx"]++;
    else if (e.status >= 300) counts["3xx"]++;
    else if (e.status >= 200) counts["2xx"]++;
  }
  return Object.entries(counts)
    .filter(([, v]) => v > 0)
    .map(([code, value]) => ({ name: `HTTP ${code}`, code, value }));
}

function topEndpoints(entries: LogEntry[], n = 10) {
  const map = new Map<string, { count: number; errorCount: number; totalTime: number; timeCount: number }>();
  for (const e of entries) {
    const key = e.path.split("?")[0];
    const cur = map.get(key) ?? { count: 0, errorCount: 0, totalTime: 0, timeCount: 0 };
    cur.count++;
    if (e.status >= 400) cur.errorCount++;
    if (e.responseTime != null) { cur.totalTime += e.responseTime; cur.timeCount++; }
    map.set(key, cur);
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, n)
    .map(([path, v]) => ({
      path,
      count: v.count,
      errorCount: v.errorCount,
      avgTime: v.timeCount > 0 ? Math.round(v.totalTime / v.timeCount) : 0,
    }));
}

function topIps(entries: LogEntry[], n = 10) {
  const map = new Map<string, { count: number; lastSeen: string }>();
  for (const e of entries) {
    const cur = map.get(e.ip) ?? { count: 0, lastSeen: e.timestamp };
    cur.count++;
    if (e.timestamp > cur.lastSeen) cur.lastSeen = e.timestamp;
    map.set(e.ip, cur);
  }
  return Array.from(map.entries())
    .sort(([, a], [, b]) => b.count - a.count)
    .slice(0, n)
    .map(([ip, v]) => ({ ip, ...v }));
}

export function buildAnalytics() {
  const entries = logService.getAll();
  const total = entries.length;
  const errors = entries.filter((e) => e.status >= 400).length;
  const ips = new Set(entries.map((e) => e.ip)).size;
  const timings = entries.filter((e) => e.responseTime != null).map((e) => e.responseTime!);
  const avgResponseTime = timings.length
    ? Math.round(timings.reduce((a, b) => a + b, 0) / timings.length)
    : 0;

  return {
    totalRequests: total,
    errorRate: total > 0 ? parseFloat(((errors / total) * 100).toFixed(2)) : 0,
    uniqueIps: ips,
    avgResponseTime,
    requestsPerMinute: bucketByMinute(entries),
    statusDistribution: statusDistribution(entries),
    topEndpoints: topEndpoints(entries),
    topIps: topIps(entries),
  };
}

export function getCurrentMetrics() {
  const entries = logService.getAll();
  const total = entries.length;
  const errors = entries.filter((e) => e.status >= 400).length;
  const timings = entries.filter((e) => e.responseTime != null).map((e) => e.responseTime!);
  const avgResponseTime = timings.length
    ? Math.round(timings.reduce((a, b) => a + b, 0) / timings.length)
    : 0;
  const recentEntries = entries.slice(-60);
  const requestRate = recentEntries.length;
  return {
    errorRate: total > 0 ? (errors / total) * 100 : 0,
    responseTime: avgResponseTime,
    requestRate,
  };
}