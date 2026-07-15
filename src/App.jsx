/**
 * App.jsx
 * Two separate concepts:
 *   myUserId / myUserName  → this browser's own identity (never changed by picker)
 *   targetUserId           → who to send notification to (changed by picker)
 */

import { useState }                                    from "react";
import { BrowserRouter, Routes, Route, NavLink }       from "react-router-dom";

import NotificationSetup  from "./components/NotificationSetup";
import NotificationSender from "./components/NotificationSender";
import UserPicker         from "./components/UserPicker";
import Home               from "./pages/Home";
import OrderDetail        from "./pages/OrderDetail";
import ChatDetail         from "./pages/ChatDetail";
import DesignDetail       from "./pages/DesignDetail";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";

export default function App() {
  // ── My own identity (used for registering this device) ─────────────────────
  const [myUserId,   setMyUserId]   = useState("");
  const [myUserName, setMyUserName] = useState("");

  // ── Target: who to send notification to (set by UserPicker) ───────────────
  const [targetUserId, setTargetUserId] = useState("");

  const handleUserReady = async (uid, name) => {
    if (!uid || !name) return;
    try {
      await fetch(`${API_BASE}/api/v1/users/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ user_id: uid, name }),
      });
    } catch (e) {
      console.warn("[App] Could not register user:", e);
    }
  };

  return (
    <BrowserRouter>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; }
        body { margin: 0; background: #0f172a; }
        select option { background: #1e293b; color: #f1f5f9; }
        .nav-link { color: #94a3b8; text-decoration: none; font-size: 14px; padding: 6px 12px; border-radius: 6px; transition: background .15s; white-space: nowrap; }
        .nav-link:hover  { background: #334155; color: #f1f5f9; }
        .nav-link.active { background: #334155; color: #f1f5f9; }
        @media (max-width: 900px) {
          .push-layout  { flex-direction: column !important; padding: 12px !important; }
          .push-sidebar { width: 100% !important; min-width: unset !important; position: static !important; max-height: unset !important; padding-right: 0 !important; }
          .push-content { padding-left: 0 !important; margin-top: 20px; }
          .nav-links    { gap: 2px !important; }
          .nav-link     { padding: 5px 8px !important; font-size: 12px !important; }
        }
      `}</style>

      <div style={styles.app}>

        {/* ── Nav ── */}
        <nav style={styles.nav}>
          <span style={styles.navBrand}>🔔 Push Notification Service</span>
          <div className="nav-links" style={styles.navLinks}>
            <NavLink to="/"             className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>🏠 Home</NavLink>
            <NavLink to="/orders/demo"  className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>📦 Orders</NavLink>
            <NavLink to="/chats/demo"   className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>💬 Chats</NavLink>
            <NavLink to="/designs/demo" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>🎨 Designs</NavLink>
          </div>
        </nav>

        <div className="push-layout" style={styles.main}>

          {/* ── Sidebar ── */}
          <aside className="push-sidebar" style={styles.sidebar}>

            {/* My Identity — ONLY for registering this device */}
            <div style={styles.card}>
              <div style={styles.cardTitle}>🙋 My Identity</div>
              <label style={styles.label}>Display Name</label>
              <input
                style={styles.input}
                placeholder="e.g. John Doe"
                value={myUserName}
                onChange={(e) => setMyUserName(e.target.value)}
              />
              <label style={styles.label}>User ID</label>
              <input
                style={styles.input}
                placeholder="e.g. user_42"
                value={myUserId}
                onChange={(e) => setMyUserId(e.target.value)}
              />
            </div>

            {/* Enable notifications for MY device */}
            <NotificationSetup
              userId={myUserId}
              userName={myUserName}
              onReady={() => handleUserReady(myUserId, myUserName)}
            />

            {/* Pick WHO to send to — does NOT touch My Identity */}
            <UserPicker
              selectedUserId={targetUserId}
              onSelect={(uid) => setTargetUserId(uid)}
            />

            {/* Send notification to targetUserId */}
            <NotificationSender userId={targetUserId} />

          </aside>

          {/* ── Page content ── */}
          <main className="push-content" style={styles.content}>
            <Routes>
              <Route path="/"                  element={<Home />} />
              <Route path="/orders/:orderId"   element={<OrderDetail />} />
              <Route path="/chats/:chatId"     element={<ChatDetail />} />
              <Route path="/designs/:designId" element={<DesignDetail />} />
              <Route path="*" element={
                <div style={{ textAlign: "center", paddingTop: 80 }}>
                  <div style={{ fontSize: 52 }}>🔔</div>
                  <p style={{ color: "#94a3b8", marginTop: 16 }}>
                    Register your device, pick a user, and send a notification.
                  </p>
                </div>
              } />
            </Routes>
          </main>

        </div>
      </div>
    </BrowserRouter>
  );
}

const styles = {
  app:       { minHeight: "100vh", background: "#0f172a", color: "#f1f5f9", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" },
  nav:       { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 24px", background: "#1e293b", borderBottom: "1px solid #334155", position: "sticky", top: 0, zIndex: 200 },
  navBrand:  { color: "#f1f5f9", fontWeight: 700, fontSize: 17, whiteSpace: "nowrap" },
  navLinks:  { display: "flex", alignItems: "center", gap: 4 },
  main:      { display: "flex", maxWidth: 1280, margin: "0 auto", padding: "20px", alignItems: "flex-start" },
  sidebar:   { width: 380, minWidth: 320, flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, position: "sticky", top: 65, maxHeight: "calc(100vh - 80px)", overflowY: "auto", paddingRight: 8 },
  card:      { background: "#1e293b", borderRadius: 10, padding: "14px 16px", display: "flex", flexDirection: "column", gap: 8 },
  cardTitle: { color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 2 },
  label:     { color: "#94a3b8", fontSize: 12, fontWeight: 500 },
  input:     { background: "#0f172a", border: "1px solid #334155", borderRadius: 7, color: "#f1f5f9", padding: "8px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", width: "100%" },
  content:   { flex: 1, minWidth: 0, paddingLeft: 28 },
};
