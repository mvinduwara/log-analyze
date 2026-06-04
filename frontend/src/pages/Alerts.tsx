import { useEffect, useState } from "react";
import { Trash2, ToggleLeft, ToggleRight } from "lucide-react";
import { AlertRuleForm } from "@/components/alerts/AlertRuleForm";
import { AlertHistory } from "@/components/alerts/AlertHistory";
import { fetchAlertRules, fetchAlertEvents, deleteAlertRule } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";
import type { AlertRule, AlertEvent } from "@/types";
import { Badge } from "@/components/ui/Badge";
import { formatDate } from "@/lib/utils";

export default function Alerts() {
  const addToast = useAppStore((s) => s.addToast);
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [events, setEvents] = useState<AlertEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [r, e] = await Promise.all([fetchAlertRules(), fetchAlertEvents()]);
        setRules(r);
        setEvents(e);
      } catch {
        addToast({ type: "error", message: "Failed to load alert data" });
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [addToast]);

  async function handleDelete(id: string) {
    try {
      await deleteAlertRule(id);
      setRules((r) => r.filter((x) => x.id !== id));
      addToast({ type: "success", message: "Rule deleted" });
    } catch {
      addToast({ type: "error", message: "Failed to delete rule" });
    }
  }

  const metricLabels: Record<string, string> = {
    errorRate: "Error Rate %",
    responseTime: "Resp. Time ms",
    requestRate: "Req/min",
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: 20, alignItems: "start" }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <AlertRuleForm onCreated={(rule) => setRules((r) => [...r, rule])} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            background: "var(--bg-surface)",
            border: "1px solid var(--border)",
            borderRadius: 10,
            overflow: "hidden",
          }}
        >
          <div style={{ padding: "16px 20px", borderBottom: "1px solid var(--border)" }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)" }}>
              Active Rules
            </span>
          </div>
          {loading ? (
            <div style={{ padding: 24 }}>
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="skeleton" style={{ height: 52, marginBottom: 8, borderRadius: 6 }} />
              ))}
            </div>
          ) : rules.length === 0 ? (
            <div style={{ padding: 40, textAlign: "center", color: "var(--text-muted)", fontSize: 13 }}>
              No alert rules yet. Create one on the left.
            </div>
          ) : (
            rules.map((rule) => (
              <div
                key={rule.id}
                style={{
                  padding: "14px 20px",
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 4 }}>
                    {rule.name}
                  </div>
                  <div style={{ fontSize: 11, fontFamily: "var(--font-mono)", color: "var(--text-muted)" }}>
                    {metricLabels[rule.metric]} {rule.operator === "gt" ? ">" : "<"} {rule.threshold} · {formatDate(rule.createdAt)}
                  </div>
                </div>
                <Badge
                  label={rule.enabled ? "Active" : "Paused"}
                  color={rule.enabled ? "var(--accent-green)" : "var(--text-muted)"}
                  bg={rule.enabled ? "var(--accent-green-dim)" : "var(--bg-elevated)"}
                />
                <button
                  onClick={() => handleDelete(rule.id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "var(--text-muted)",
                    lineHeight: 0,
                    padding: 4,
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--accent-red)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)")}
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        <AlertHistory events={events} loading={loading} />
      </div>
    </div>
  );
}