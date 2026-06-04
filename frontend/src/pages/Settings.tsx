import { useState } from "react";
import { Save, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";

const LOG_FORMATS = [
  {
    id: "combined",
    name: "Apache Combined",
    description: "Standard Apache combined log format with referrer and user agent",
    example: '127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326 "http://www.example.com" "Mozilla/4.08"',
  },
  {
    id: "nginx",
    name: "Nginx Access",
    description: "Default Nginx access log format",
    example: '127.0.0.1 - - [10/Oct/2000:13:55:36 +0000] "GET / HTTP/1.1" 200 612 "-" "curl/7.68.0"',
  },
  {
    id: "common",
    name: "Apache Common",
    description: "Common log format without referrer and user agent fields",
    example: '127.0.0.1 - frank [10/Oct/2000:13:55:36 -0700] "GET /apache_pb.gif HTTP/1.0" 200 2326',
  },
];

export default function Settings() {
  const addToast = useAppStore((s) => s.addToast);
  const [format, setFormat] = useState("combined");
  const [maxEntries, setMaxEntries] = useState(100000);
  const [pageSize, setPageSize] = useState(50);

  function save() {
    addToast({ type: "success", message: "Settings saved successfully" });
  }

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
    marginBottom: 8,
    display: "block",
  };

  const selected = LOG_FORMATS.find((f) => f.id === format)!;

  return (
    <div style={{ maxWidth: 720, display: "flex", flexDirection: "column", gap: 20 }}>
      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "24px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18 }}>
          Log Format
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
          {LOG_FORMATS.map((f) => (
            <label
              key={f.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                padding: "14px 16px",
                border: `1px solid ${format === f.id ? "var(--accent-cyan)" : "var(--border)"}`,
                borderRadius: 8,
                cursor: "pointer",
                background: format === f.id ? "var(--accent-cyan-dim)" : "var(--bg-elevated)",
                transition: "all 0.15s",
              }}
            >
              <input
                type="radio"
                name="format"
                value={f.id}
                checked={format === f.id}
                onChange={() => setFormat(f.id)}
                style={{ marginTop: 2, accentColor: "var(--accent-cyan)" }}
              />
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)", marginBottom: 3 }}>
                  {f.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>{f.description}</div>
              </div>
            </label>
          ))}
        </div>
        <div
          style={{
            background: "var(--bg-base)",
            border: "1px solid var(--border)",
            borderRadius: 6,
            padding: 14,
            display: "flex",
            gap: 8,
            alignItems: "flex-start",
          }}
        >
          <Info size={13} color="var(--accent-cyan)" style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <div style={{ fontSize: 10, color: "var(--text-muted)", marginBottom: 4, letterSpacing: "0.05em" }}>
              EXAMPLE
            </div>
            <code style={{ fontSize: 10, color: "var(--text-secondary)", fontFamily: "var(--font-mono)", wordBreak: "break-all", lineHeight: 1.7 }}>
              {selected.example}
            </code>
          </div>
        </div>
      </div>

      <div
        style={{
          background: "var(--bg-surface)",
          border: "1px solid var(--border)",
          borderRadius: 10,
          padding: "24px",
        }}
      >
        <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 18 }}>
          Performance & Retention
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label style={labelStyle}>Max Entries in Memory</label>
            <input
              type="number"
              style={inputStyle}
              value={maxEntries}
              onChange={(e) => setMaxEntries(Number(e.target.value))}
              min={1000}
              max={1000000}
              step={1000}
            />
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>
              Older entries are evicted when this limit is reached
            </div>
          </div>
          <div>
            <label style={labelStyle}>Default Page Size</label>
            <select
              style={{ ...inputStyle, cursor: "pointer" }}
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[25, 50, 100, 200].map((n) => (
                <option key={n} value={n}>{n} entries</option>
              ))}
            </select>
            <div style={{ fontSize: 11, color: "var(--text-muted)", marginTop: 5 }}>
              Default number of rows shown in Log Explorer
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={save}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 8,
          background: "var(--accent-cyan)",
          border: "none",
          borderRadius: 8,
          padding: "12px 24px",
          color: "#0a0b0e",
          fontSize: 14,
          fontWeight: 700,
          fontFamily: "var(--font-display)",
          cursor: "pointer",
          width: "fit-content",
          letterSpacing: "-0.01em",
        }}
      >
        <Save size={15} />
        Save Settings
      </button>
    </div>
  );
}