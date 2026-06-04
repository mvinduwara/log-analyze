import { useState } from "react";
import { Plus } from "lucide-react";
import { createAlertRule } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { AlertRule } from "@/types";

interface Props {
  onCreated: (rule: AlertRule) => void;
}

export function AlertRuleForm({ onCreated }: Props) {
  const addToast = useAppStore((s) => s.addToast);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    metric: "errorRate" as AlertRule["metric"],
    operator: "gt" as AlertRule["operator"],
    threshold: 5,
    enabled: true,
  });

  const inputStyle: React.CSSProperties = {
    background: "var(--bg-elevated)",
    border: "1px solid var(--border)",
    borderRadius: 6,
    padding: "8px 12px",
    color: "var(--text-primary)",
    fontSize: 12,
    fontFamily: "var(--font-mono)",
    outline: "none",
    width: "100%",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.1em",
    color: "var(--text-muted)",
    textTransform: "uppercase",
    marginBottom: 5,
    display: "block",
  };

  async function handleSubmit() {
    if (!form.name.trim()) {
      addToast({ type: "error", message: "Rule name is required" });
      return;
    }
    setLoading(true);
    try {
      const rule = await createAlertRule(form);
      onCreated(rule);
      addToast({ type: "success", message: `Alert rule "${rule.name}" created` });
      setForm({ name: "", metric: "errorRate", operator: "gt", threshold: 5, enabled: true });
    } catch {
      addToast({ type: "error", message: "Failed to create alert rule" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "var(--bg-surface)",
        border: "1px solid var(--border)",
        borderRadius: 10,
        padding: "20px 24px",
      }}
    >
      <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18 }}>
        New Alert Rule
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div>
          <label style={labelStyle}>Rule Name</label>
          <input
            style={inputStyle}
            placeholder="e.g. High Error Rate"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
          />
        </div>
        <div>
          <label style={labelStyle}>Metric</label>
          <select
            style={{ ...inputStyle, cursor: "pointer" }}
            value={form.metric}
            onChange={(e) => setForm((f) => ({ ...f, metric: e.target.value as AlertRule["metric"] }))}
          >
            <option value="errorRate">Error Rate (%)</option>
            <option value="responseTime">Avg Response Time (ms)</option>
            <option value="requestRate">Request Rate (req/min)</option>
          </select>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          <div>
            <label style={labelStyle}>Condition</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={form.operator}
              onChange={(e) => setForm((f) => ({ ...f, operator: e.target.value as AlertRule["operator"] }))}
            >
              <option value="gt">Greater than (&gt;)</option>
              <option value="lt">Less than (&lt;)</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Threshold</label>
            <input
              type="number"
              style={inputStyle}
              value={form.threshold}
              onChange={(e) => setForm((f) => ({ ...f, threshold: Number(e.target.value) }))}
            />
          </div>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            background: "var(--accent-cyan)",
            border: "none",
            borderRadius: 7,
            padding: "10px 18px",
            color: "#0a0b0e",
            fontSize: 13,
            fontWeight: 700,
            fontFamily: "var(--font-display)",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.7 : 1,
            transition: "opacity 0.15s",
          }}
        >
          <Plus size={14} />
          Create Rule
        </button>
      </div>
    </div>
  );
}