import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts";
import type { StatusCount } from "@/types";

const COLORS: Record<string, string> = {
  "2xx": "var(--accent-green)",
  "3xx": "var(--accent-purple)",
  "4xx": "var(--accent-amber)",
  "5xx": "var(--accent-red)",
};

interface Props {
  data: StatusCount[];
  loading?: boolean;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0];
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-bright)",
        borderRadius: 6,
        padding: "8px 12px",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
      }}
    >
      <span style={{ color: d.payload.fill }}>{d.name}</span>:{" "}
      <strong style={{ color: "var(--text-primary)" }}>{d.value}</strong>
    </div>
  );
}

function CustomLegend({ payload }: any) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 8 }}>
      {payload?.map((entry: any) => (
        <div key={entry.value} style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: 2,
              background: entry.color,
            }}
          />
          <span style={{ fontSize: 11, color: "var(--text-secondary)", fontFamily: "var(--font-mono)" }}>
            {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StatusDonut({ data, loading }: Props) {
  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 24px",
      }}
    >
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
          Status Distribution
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          Response code breakdown
        </div>
      </div>
      {loading && data.length === 0 ? (
        <div className="skeleton" style={{ height: 180 }} />
      ) : (
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie
              data={data}
              cx="40%"
              cy="50%"
              innerRadius={50}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, i) => (
                <Cell
                  key={i}
                  fill={COLORS[entry.code] ?? "var(--text-muted)"}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              layout="vertical"
              align="right"
              verticalAlign="middle"
              content={<CustomLegend />}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
