export const APACHE_COMBINED =
  /^(\S+)\s+\S+\s+(\S+)\s+\[([^\]]+)\]\s+"(\S+)\s+(\S+)\s+(\S+)"\s+(\d{3})\s+(\S+)(?:\s+"([^"]*)"\s+"([^"]*)")?/;

export const NGINX_WITH_TIME =
  /^(\S+)\s+-\s+(\S+)\s+\[([^\]]+)\]\s+"(\S+)\s+(\S+)\s+(\S+)"\s+(\d{3})\s+(\S+)\s+"([^"]*)"\s+"([^"]*)"\s+(\S+)/;

export const LOG_DATE_FORMAT = /(\d{2})\/(\w{3})\/(\d{4}):(\d{2}):(\d{2}):(\d{2})\s+([-+]\d{4})/;

const MONTHS: Record<string, number> = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

export function parseLogDate(raw: string): string {
  const m = LOG_DATE_FORMAT.exec(raw);
  if (!m) return new Date().toISOString();
  const [, day, mon, year, hh, mm, ss] = m;
  const d = new Date(
    Date.UTC(parseInt(year), MONTHS[mon] ?? 0, parseInt(day), parseInt(hh), parseInt(mm), parseInt(ss))
  );
  return d.toISOString();
}