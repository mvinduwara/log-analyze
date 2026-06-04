import { X, CheckCircle, AlertTriangle, XCircle, Info } from "lucide-react";
import { useAppStore } from "@/store/useAppStore";
import type { Toast as ToastType } from "@/types";

const icons = {
  success: <CheckCircle size={15} color="var(--accent-green)" />,
  error: <XCircle size={15} color="var(--accent-red)" />,
  warning: <AlertTriangle size={15} color="var(--accent-amber)" />,
  info: <Info size={15} color="var(--accent-cyan)" />,
};

const colors: Record<ToastType["type"], string> = {
  success: "var(--accent-green)",
  error: "var(--accent-red)",
  warning: "var(--accent-amber)",
  info: "var(--accent-cyan)",
};

function ToastItem({ toast }: { toast: ToastType }) {
  const removeToast = useAppStore((s) => s.removeToast);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        background: "var(--bg-elevated)",
        border: `1px solid var(--border-bright)`,
        borderLeft: `3px solid ${colors[toast.type]}`,
        borderRadius: 6,
        padding: "12px 14px",
        minWidth: 280,
        maxWidth: 380,
        animation: "slide-in-right 0.3s ease both",
        boxShadow: "0 8px 30px rgba(0,0,0,0.4)",
      }}
    >
      {icons[toast.type]}
      <span
        style={{
          flex: 1,
          fontSize: 13,
          color: "var(--text-primary)",
          fontFamily: "var(--font-display)",
        }}
      >
        {toast.message}
      </span>
      <button
        onClick={() => removeToast(toast.id)}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "var(--text-muted)",
          padding: 0,
          lineHeight: 0,
        }}
      >
        <X size={13} />
      </button>
    </div>
  );
}

export function ToastContainer() {
  const toasts = useAppStore((s) => s.toasts);
  return (
    <div
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        display: "flex",
        flexDirection: "column",
        gap: 8,
        zIndex: 9999,
      }}
    >
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} />
      ))}
    </div>
  );
}