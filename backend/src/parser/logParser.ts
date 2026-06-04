import { randomUUID } from "crypto";
import { APACHE_COMBINED, NGINX_WITH_TIME, parseLogDate } from "./formats";
import type { LogEntry } from "../types";

function safeInt(s: string, fallback = 0): number {
  const n = parseInt(s, 10);
  return isNaN(n) ? fallback : n;
}

export function parseLine(line: string): LogEntry | null {
  const raw = line.trim();
  if (!raw) return null;

  let m = NGINX_WITH_TIME.exec(raw);
  if (m) {
    const [, ip, , dateRaw, method, path, protocol, status, size, referrer, userAgent, rt] = m;
    return {
      id: randomUUID(),
      ip,
      timestamp: parseLogDate(dateRaw),
      method: method.toUpperCase(),
      path,
      protocol,
      status: safeInt(status),
      size: safeInt(size),
      referrer: referrer === "-" ? "" : referrer,
      userAgent: userAgent === "-" ? "" : userAgent,
      responseTime: rt && rt !== "-" ? Math.round(parseFloat(rt) * 1000) : undefined,
      raw,
    };
  }

  m = APACHE_COMBINED.exec(raw);
  if (m) {
    const [, ip, , dateRaw, method, path, protocol, status, size, referrer = "", userAgent = ""] = m;
    return {
      id: randomUUID(),
      ip,
      timestamp: parseLogDate(dateRaw),
      method: method.toUpperCase(),
      path,
      protocol,
      status: safeInt(status),
      size: safeInt(size === "-" ? "0" : size),
      referrer: referrer === "-" ? "" : referrer,
      userAgent: userAgent === "-" ? "" : userAgent,
      raw,
    };
  }

  return null;
}

export function parseBuffer(text: string): { entries: LogEntry[]; failed: number } {
  const lines = text.split("\n");
  const entries: LogEntry[] = [];
  let failed = 0;
  for (const line of lines) {
    const entry = parseLine(line);
    if (entry) entries.push(entry);
    else if (line.trim()) failed++;
  }
  return { entries, failed };
}