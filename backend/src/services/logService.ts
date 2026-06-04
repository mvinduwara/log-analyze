import type { LogEntry } from "../types";
import { config } from "../config";

class LogService {
  private entries: LogEntry[] = [];

  add(incoming: LogEntry[]): void {
    this.entries.push(...incoming);
    if (this.entries.length > config.maxEntries) {
      this.entries = this.entries.slice(this.entries.length - config.maxEntries);
    }
  }

  clear(): void {
    this.entries = [];
  }

  getAll(): LogEntry[] {
    return this.entries;
  }

  query(opts: {
    search?: string;
    method?: string;
    statusMin?: number;
    statusMax?: number;
    ip?: string;
    path?: string;
    dateFrom?: string;
    dateTo?: string;
    page: number;
    pageSize: number;
  }): { data: LogEntry[]; total: number } {
    let filtered = this.entries;

    if (opts.search) {
      const q = opts.search.toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.path.toLowerCase().includes(q) ||
          e.ip.includes(q) ||
          e.userAgent.toLowerCase().includes(q) ||
          e.raw.toLowerCase().includes(q)
      );
    }
    if (opts.method) {
      const m = opts.method.toUpperCase();
      filtered = filtered.filter((e) => e.method === m);
    }
    if (opts.statusMin != null) filtered = filtered.filter((e) => e.status >= opts.statusMin!);
    if (opts.statusMax != null) filtered = filtered.filter((e) => e.status <= opts.statusMax!);
    if (opts.ip) filtered = filtered.filter((e) => e.ip.includes(opts.ip!));
    if (opts.path) {
      const p = opts.path.toLowerCase();
      filtered = filtered.filter((e) => e.path.toLowerCase().includes(p));
    }
    if (opts.dateFrom) {
      const from = new Date(opts.dateFrom).getTime();
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() >= from);
    }
    if (opts.dateTo) {
      const to = new Date(opts.dateTo).getTime();
      filtered = filtered.filter((e) => new Date(e.timestamp).getTime() <= to);
    }

    const total = filtered.length;
    const start = (opts.page - 1) * opts.pageSize;
    const data = filtered.slice(start, start + opts.pageSize).reverse();
    return { data, total };
  }

  count(): number {
    return this.entries.length;
  }
}

export const logService = new LogService();