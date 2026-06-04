import { Spinner } from "./Spinner";
import type { ReactNode } from "react";

interface KpiCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: string;
  loading?: boolean;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
}

export function KpiCard({
  label,
  value,
  sub,
  icon,
  accent = "var(--accent-cyan)",
  loading = false,
  trend,
  trendValue,
}: KpiCardProps) {
  const trendColor =
    trend === "up"
      ? "var(--accent-green)"
      : trend === "down"
      ? "var(--accent-red)"
      : "var(--text-muted)";

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
        overflow: "hidden",
        transition: "border-color 0.2s",
      }}
      onMouseEnter={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border-bright)")
      }
      onMouseLeave={(e) =>
        ((e.currentTarget as HTMLDivElement).style.borderColor =
          "var(--border)")
      }
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          width: 80,
          height: 80,
          background: `radial-gradient(circle at top right, ${accent}18, transparent 70%)`,
        }}
      />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--text-muted)",
          }}
        >
          {label}
        </span>
        <div
          style={{
            color: accent,
            background: `${accent}18`,
            borderRadius: 6,
            padding: "6px",
            lineHeight: 0,
          }}
        >
          {icon}
        </div>
      </div>
      {loading ? (
        <div className="skeleton" style={{ height: 34, width: "60%" }} />
      ) : (
        <div
          style={{
            fontSize: 30,
            fontWeight: 800,
            color: "var(--text-primary)",
            letterSpacing: "-0.03em",
            lineHeight: 1,
          }}
        >
          {value}
        </div>
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        {sub && (
          <span style={{ fontSize: 12, color: "var(--text-secondary)" }}>{sub}</span>
        )}
        {trendValue && (
          <span
            style={{
              fontSize: 11,
              fontFamily: "var(--font-mono)",
              color: trendColor,
              fontWeight: 700,
            }}
          >
            {trend === "up" ? "↑" : trend === "down" ? "↓" : "→"} {trendValue}
          </span>
        )}
      </div>
    </div>
  );
}