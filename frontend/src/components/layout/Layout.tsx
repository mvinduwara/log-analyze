import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { ToastContainer } from "@/components/ui/Toast";

export function Layout() {
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <Sidebar />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <Topbar />
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            background: "var(--bg-base)",
          }}
        >
          <Outlet />
        </main>
      </div>
      <ToastContainer />
    </div>
  );
}