import { format, parseISO, isValid } from "date-fns";

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatDate(iso: string): string {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, "dd MMM yyyy HH:mm:ss");
  } catch {
    return iso;
  }
}

export function formatShortDate(iso: string): string {
  try {
    const d = parseISO(iso);
    if (!isValid(d)) return iso;
    return format(d, "HH:mm:ss");
  } catch {
    return iso;
  }
}

export function statusColor(status: number): string {
  if (status >= 500) return "var(--accent-red)";
  if (status >= 400) return "var(--accent-amber)";
  if (status >= 300) return "var(--accent-purple)";
  if (status >= 200) return "var(--accent-green)";
  return "var(--text-secondary)";
}

export function statusLabel(status: number): string {
  if (status >= 500) return "5xx";
  if (status >= 400) return "4xx";
  if (status >= 300) return "3xx";
  if (status >= 200) return "2xx";
  return "1xx";
}

export function methodColor(method: string): string {
  const map: Record<string, string> = {
    GET: "var(--accent-cyan)",
    POST: "var(--accent-green)",
    PUT: "var(--accent-amber)",
    PATCH: "var(--accent-purple)",
    DELETE: "var(--accent-red)",
    HEAD: "var(--text-secondary)",
    OPTIONS: "var(--text-muted)",
  };
  return map[method.toUpperCase()] ?? "var(--text-secondary)";
}

export function truncate(str: string, max: number): string {
  return str.length <= max ? str : str.slice(0, max) + "…";
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}