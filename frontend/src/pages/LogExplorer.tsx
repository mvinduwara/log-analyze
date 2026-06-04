import { useCallback, useRef } from "react";
import { Upload, Download } from "lucide-react";
import { FilterPanel } from "@/components/logs/FilterPanel";
import { LogTable } from "@/components/logs/LogTable";
import { Spinner } from "@/components/ui/Spinner";
import { uploadLogFile } from "@/lib/api";
import { useAppStore } from "@/store/useAppStore";

export default function LogExplorer() {
  const addToast = useAppStore((s) => s.addToast);
  const isUploading = useAppStore((s) => s.isUploading);
  const setUploading = useAppStore((s) => s.setUploading);
  const uploadedFile = useAppStore((s) => s.uploadedFile);
  const setUploadedFile = useAppStore((s) => s.setUploadedFile);
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useStateToggle();

  async function handleFile(file: File) {
    if (!file.name.match(/\.(log|txt|access)$/i)) {
      addToast({ type: "error", message: "Please upload a .log or .txt file" });
      return;
    }
    setUploading(true);
    try {
      const result = await uploadLogFile(file);
      setUploadedFile(file.name);
      addToast({
        type: "success",
        message: `Parsed ${result.parsed.toLocaleString()} entries from ${result.filename}`,
      });
    } catch {
      addToast({ type: "error", message: "Upload failed. Check the file format." });
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => fileRef.current?.click()}
        style={{
          border: `2px dashed ${dragging ? "var(--accent-cyan)" : "var(--border-bright)"}`,
          borderRadius: 10,
          padding: "28px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          cursor: "pointer",
          background: dragging ? "var(--accent-cyan-dim)" : "var(--bg-surface)",
          transition: "all 0.2s",
          flexDirection: "column",
        }}
      >
        {isUploading ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--text-secondary)" }}>
            <Spinner />
            <span style={{ fontSize: 13 }}>Parsing log file…</span>
          </div>
        ) : (
          <>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Upload size={20} color="var(--accent-cyan)" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)" }}>
                Drop a log file here, or click to browse
              </span>
            </div>
            <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
              Supports Apache Combined Log Format, Nginx access logs (.log, .txt)
              {uploadedFile && (
                <span style={{ color: "var(--accent-green)", marginLeft: 12 }}>
                  ✓ {uploadedFile} loaded
                </span>
              )}
            </span>
          </>
        )}
        <input
          ref={fileRef}
          type="file"
          accept=".log,.txt,.access"
          style={{ display: "none" }}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            e.target.value = "";
          }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 14, alignItems: "start" }}>
        <FilterPanel />
        <LogTable />
      </div>
    </div>
  );
}

function useStateToggle(): [boolean, (v: boolean) => void] {
  const [v, setV] = require("react").useState(false);
  return [v, setV];
}