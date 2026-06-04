interface BadgeProps {
  label: string;
  color?: string;
  bg?: string;
  size?: "sm" | "md";
}

export function Badge({
  label,
  color = "var(--accent-cyan)",
  bg = "var(--accent-cyan-dim)",
  size = "sm",
}: BadgeProps) {
  const pad = size === "sm" ? "2px 7px" : "4px 10px";
  const fs = size === "sm" ? "10px" : "12px";
  return (
    <span
      style={{
        display: "inline-block",
        padding: pad,
        background: bg,
        color,
        fontSize: fs,
        fontFamily: "var(--font-mono)",
        fontWeight: 700,
        letterSpacing: "0.05em",
        borderRadius: 3,
        lineHeight: "1.6",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </span>
  );
}