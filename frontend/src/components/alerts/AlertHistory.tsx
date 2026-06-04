import { AlertTriangle, Clock } from "lucide-react";
import type { AlertEvent } from "@/types";
import { formatDate } from "@/lib/utils";

interface Props {
  events: AlertEvent[];
  loading: boolean;
}

export function AlertHistory({ events, loading }: Props) {
  return (
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
        <Clock size={14} color="var(--accent-amber)" />
        <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          Alert History
        </span>
        <span
          style={{
            marginLeft: "auto",
            fontSize: 11,
            fontFamily: "var(--font-mono)",
            color: "var(--text-muted)",
            background: "var(--bg-elevated)",
            padding: "2px 8px",
            borderRadius: 4,
          }}
        >
          {events.length} events
        </span>
      </div>
      <div style={{ maxHeight: 400, overflowY: "auto" }}>
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ padding: "14px 20px", borderBottom: "1px solid var(--border)" }}>
              <div className="skeleton" style={{ height: 14, width: "60%", marginBottom: 8 }} />
              <div className="skeleton" style={{ height: 11, width: "40%" }} />
            </div>
          ))
        ) : events.length === 0 ? (
          <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
            No alerts triggered yet
          </div>
        ) : (
          events.map((ev) => (
            <div
              key={ev.id}
              style={{
                padding: "14px 20px",
                borderBottom: "1px solid var(--border)",
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                transition: "background 0.1s",
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = "var(--bg-hover)")
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background = "transparent")
              }
            >
              <div style={{ marginTop: 2, flexShrink: 0 }}>
                <AlertTriangle size={14} color="var(--accent-amber)" />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                  {ev.ruleName}
                </div>
                <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                  {ev.metric} = {ev.value.toFixed(2)} (threshold: {ev.threshold}) · {formatDate(ev.triggeredAt)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}