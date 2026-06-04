import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  ScrollText,
  Bell,
  Settings,
  Zap,
} from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: <LayoutDashboard size={17} /> },
  { to: "/logs", label: "Log Explorer", icon: <ScrollText size={17} /> },
  { to: "/alerts", label: "Alerts", icon: <Bell size={17} /> },
  { to: "/settings", label: "Settings", icon: <Settings size={17} /> },
];

export function Sidebar() {
  return (
    <aside
      style={{
        width: 220,
        flexShrink: 0,
        background: "var(--bg-surface)",
        borderRight: "1px solid var(--border)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      <div
        style={{
          padding: "24px 20px 20px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 30,
            height: 30,
            background: "#ffffff",
            borderRadius: 7,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >

          <Zap size={15} color="#000" fill="#000" />
        </div>
        <div>
          <div
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            LogLens
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", letterSpacing: "0.1em" }}>
            ANALYZER v1.0
          </div>
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px" }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", color: "var(--text-muted)", padding: "8px 10px 6px", textTransform: "uppercase" }}>
          Navigation
        </div>
        {navItems.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            style={({ isActive }) => ({
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 10px",
              borderRadius: 7,
              marginBottom: 2,
              textDecoration: "none",
              fontSize: 13,
              fontWeight: isActive ? 700 : 500,
              color: isActive ? "var(--accent-cyan)" : "var(--text-secondary)",
              background: isActive ? "var(--accent-cyan-dim)" : "transparent",
              transition: "all 0.15s",
              borderLeft: isActive ? "2px solid var(--accent-cyan)" : "2px solid transparent",
            })}
          >
            {icon}
            {label}
          </NavLink>
        ))}
      </nav>

      <div
        style={{
          padding: "16px 20px",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "var(--text-muted)",
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--accent-green)",
              animation: "pulse-glow 2s infinite",
            }}
          />
          Live monitoring active
        </div>
      </div>
    </aside>
  );
}