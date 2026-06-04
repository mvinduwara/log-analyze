import { useLocation } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/store/useAppStore";
import { clearLogs } from "@/lib/api";

const titles: Record<string, { title: string; sub: string }> = {
  "/": { title: "Dashboard", sub: "Real-time server log analytics" },
  "/logs": { title: "Log Explorer", sub: "Search, filter, and inspect log entries" },
  "/alerts": { title: "Alerts", sub: "Configure rules and review alert history" },
  "/settings": { title: "Settings", sub: "Parser configuration and preferences" },
};

export function Topbar() {
  const { pathname } = useLocation();
  const meta = titles[pathname] ?? titles["/"];
  const addToast = useAppStore((s) => s.addToast);
  const [clearing, setClearing] = useState(false);

  async function handleClear() {
    setClearing(true);
    try {
      await clearLogs();
      addToast({ type: "success", message: "All logs cleared from memory" });
    } catch {
      addToast({ type: "error", message: "Failed to clear logs" });
    } finally {
      setClearing(false);
    }
  }

  return (
    <header
      style={{
        height: 60,
        borderBottom: "1px solid var(--border)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 28px",
        background: "var(--bg-surface)",
        flexShrink: 0,
      }}
    >
      <div>
        <h1
          style={{
            fontSize: 17,
            fontWeight: 800,
            letterSpacing: "-0.02em",
            color: "var(--text-primary)",
          }}
        >
          {meta.title}
        </h1>
        <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{meta.sub}</div>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button
          onClick={handleClear}
          disabled={clearing}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: 7,
            padding: "7px 14px",
            color: "var(--text-secondary)",
            cursor: clearing ? "not-allowed" : "pointer",
            fontSize: 12,
            fontFamily: "var(--font-display)",
            fontWeight: 600,
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent-red)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--accent-red)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--border)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)";
          }}
        >
          <RefreshCw size={13} style={{ animation: clearing ? "spin 0.7s linear infinite" : "none" }} />
          Clear Logs
        </button>
      </div>
    </header>
  );
}