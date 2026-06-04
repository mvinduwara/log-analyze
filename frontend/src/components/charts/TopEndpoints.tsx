import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import type { EndpointStat } from "@/types";
import { truncate } from "@/lib/utils";

interface Props {
  data: EndpointStat[];
  loading?: boolean;
}

function CustomTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null;
  const d = payload[0]?.payload as EndpointStat;
  return (
    <div
      style={{
        background: "var(--bg-elevated)",
        border: "1px solid var(--border-bright)",
        borderRadius: 6,
        padding: "10px 14px",
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        maxWidth: 260,
      }}
    >
      <div style={{ color: "var(--accent-cyan)", marginBottom: 6, wordBreak: "break-all" }}>{d.path}</div>
      <div style={{ color: "var(--text-secondary)" }}>
        Requests: <strong style={{ color: "var(--text-primary)" }}>{d.count}</strong>
      </div>
      <div style={{ color: "var(--text-secondary)" }}>
        Errors: <strong style={{ color: "var(--accent-red)" }}>{d.errorCount}</strong>
      </div>
      <div style={{ color: "var(--text-secondary)" }}>
        Avg Time: <strong style={{ color: "var(--text-primary)" }}>{d.avgTime}ms</strong>
      </div>
    </div>
  );
}

export function TopEndpoints({ data, loading }: Props) {
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
          Top Endpoints
        </div>
        <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 2 }}>
          Ranked by request volume
        </div>
      </div>
      {loading && data.length === 0 ? (
        <div className="skeleton" style={{ height: 200 }} />
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={data} layout="vertical">
            <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: "var(--text-muted)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="path"
              width={120}
              tick={{ fill: "var(--text-secondary)", fontSize: 10, fontFamily: "var(--font-mono)" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => truncate(v, 18)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="count" radius={[0, 3, 3, 0]} maxBarSize={16}>
              {data.map((_, i) => (
                <Cell
                  key={i}
                  fill={i === 0 ? "var(--accent-cyan)" : "var(--accent-cyan-dim)"}
                  stroke={i === 0 ? "var(--accent-cyan)" : "none"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
