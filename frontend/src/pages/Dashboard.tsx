import { useState, useCallback } from "react";
import { Activity, AlertTriangle, Users, Clock } from "lucide-react";
import { KpiCard } from "@/components/ui/KpiCard";
import { TrafficChart } from "@/components/charts/TrafficChart";
import { StatusDonut } from "@/components/charts/StatusDonut";
import { TopEndpoints } from "@/components/charts/TopEndpoints";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useWebSocket } from "@/hooks/useWebSocket";
import type { LogEntry } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { statusColor, methodColor, formatShortDate, truncate } from "@/lib/utils";

const MAX_LIVE = 20;

export default function Dashboard() {
  const { data, loading } = useAnalytics(8000);
  const [liveEntries, setLiveEntries] = useState<LogEntry[]>([]);

  const onEntry = useCallback((entry: LogEntry) => {
    setLiveEntries((prev) => [entry, ...prev].slice(0, MAX_LIVE));
  }, []);

  useWebSocket(onEntry);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 14,
        }}
        className="fade-in"
      >
        <KpiCard
          label="Total Requests"
          value={data ? data.totalRequests.toLocaleString() : "—"}
          icon={<Activity size={15} />}
          accent="var(--accent-cyan)"
          loading={loading && !data}
          sub="all parsed entries"
        />
        <KpiCard
          label="Error Rate"
          value={data ? `${data.errorRate.toFixed(2)}%` : "—"}
          icon={<AlertTriangle size={15} />}
          accent="var(--accent-red)"
          loading={loading && !data}
          sub="4xx + 5xx responses"
          trend={data && data.errorRate > 5 ? "up" : "neutral"}
          trendValue={data ? `${data.errorRate.toFixed(1)}%` : undefined}
        />
        <KpiCard
          label="Unique IPs"
          value={data ? data.uniqueIps.toLocaleString() : "—"}
          icon={<Users size={15} />}
          accent="var(--accent-green)"
          loading={loading && !data}
          sub="distinct clients"
        />
        <KpiCard
          label="Avg Response"
          value={data ? `${data.avgResponseTime}ms` : "—"}
          icon={<Clock size={15} />}
          accent="var(--accent-amber)"
          loading={loading && !data}
          sub="mean response time"
          trend={data && data.avgResponseTime > 1000 ? "up" : "neutral"}
        />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 14 }}
        className="fade-in-1"
      >
        <TrafficChart data={data?.requestsPerMinute ?? []} loading={loading && !data} />
        <StatusDonut data={data?.statusDistribution ?? []} loading={loading && !data} />
      </div>

      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        className="fade-in-2"
      >
        <TopEndpoints data={data?.topEndpoints ?? []} loading={loading && !data} />

        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid var(--border)",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            <div
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: "var(--accent-green)",
                animation: "pulse-glow 2s infinite",
              }}
            />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Live Log Stream
            </span>
          </div>
          <div style={{ maxHeight: 240, overflowY: "auto" }}>
            {liveEntries.length === 0 ? (
              <div
                style={{
                  padding: 28,
                  textAlign: "center",
                  color: "var(--text-muted)",
                  fontSize: 12,
                  fontFamily: "var(--font-mono)",
                }}
              >
                Waiting for incoming logs…
              </div>
            ) : (
              liveEntries.map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    padding: "8px 16px",
                    borderBottom: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    animation: i === 0 ? "fadeIn 0.3s ease" : "none",
                    fontSize: 11,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <span style={{ color: "var(--text-muted)", whiteSpace: "nowrap" }}>
                    {formatShortDate(entry.timestamp)}
                  </span>
                  <Badge label={entry.method} color={methodColor(entry.method)} bg={`${methodColor(entry.method)}15`} />
                  <span style={{ color: "var(--text-secondary)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {truncate(entry.path, 40)}
                  </span>
                  <Badge label={String(entry.status)} color={statusColor(entry.status)} bg={`${statusColor(entry.status)}15`} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="fade-in-3">
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Top Source IPs
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "var(--bg-elevated)" }}>
                {["IP Address", "Requests", "Last Seen"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "9px 16px",
                      textAlign: "left",
                      fontSize: 10,
                      fontWeight: 700,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      color: "var(--text-muted)",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(data?.topIps ?? []).slice(0, 8).map((ip, i) => (
                <tr
                  key={ip.ip}
                  style={{
                    borderBottom: "1px solid var(--border)",
                    animation: `fadeIn 0.3s ${i * 0.05}s ease both`,
                  }}
                >
                  <td style={{ padding: "9px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--accent-cyan)" }}>
                    {ip.ip}
                  </td>
                  <td style={{ padding: "9px 16px", fontFamily: "var(--font-mono)", fontSize: 12, color: "var(--text-primary)", fontWeight: 700 }}>
                    {ip.count.toLocaleString()}
                  </td>
                  <td style={{ padding: "9px 16px", fontFamily: "var(--font-mono)", fontSize: 11, color: "var(--text-muted)" }}>
                    {formatShortDate(ip.lastSeen)}
                  </td>
                </tr>
              ))}
              {(!data || data.topIps.length === 0) && (
                <tr>
                  <td colSpan={3} style={{ padding: "28px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: 12 }}>
                    No data yet — upload a log file
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}