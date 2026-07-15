/**
 * NotificationSetup.jsx
 * - Reads localStorage correctly inside lazy useState initialisers
 * - setupForegroundNotifications wired up once on mount
 */

import { useEffect, useState } from "react";
import { requestNotificationPermission, setupForegroundNotifications } from "../firebase";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const LS_KEY   = "push_reg"; // stores { userId, token }

function getSaved() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) ?? null; }
  catch { return null; }
}

export default function NotificationSetup({ userId, userName, onReady }) {

  const [status,    setStatus]    = useState(() => {
    // called once on first render — reads localStorage fresh
    const saved = getSaved();
    if (Notification.permission === "denied")                         return "denied";
    if (saved?.token && Notification.permission === "granted")        return "registered";
    return "idle";
  });

  const [regUserId, setRegUserId] = useState(() => getSaved()?.userId ?? null);
  const [token,     setToken]     = useState(() => getSaved()?.token  ?? null);
  const [errorMsg,  setErrorMsg]  = useState("");

  // ── Register service worker ────────────────────────────────────────────────
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((r) => console.log("[SW] Registered:", r.scope))
      .catch((e) => console.error("[SW] Registration failed:", e));
  }, []);

  // ── Wire up foreground → OS notification ───────────────────────────────────
  useEffect(() => {
    const unsub = setupForegroundNotifications();
    return () => unsub();
  }, []);

  // ── Derived state ──────────────────────────────────────────────────────────
  const isRegisteredForMe   = status === "registered" && regUserId === userId && userId !== "";
  const isRegisteredForOther = status === "registered" && userId !== "" && regUserId !== userId;

  // ── Enable ─────────────────────────────────────────────────────────────────
  const handleEnable = async () => {
    if (!userId)   { alert("Enter a User ID first.");       return; }
    if (!userName) { alert("Enter a Display Name first.");  return; }

    setStatus("requesting");
    setErrorMsg("");

    let permission = Notification.permission;
    if (permission === "default") permission = await Notification.requestPermission();
    if (permission === "denied")  { setStatus("denied"); return; }

    setStatus("registering");

    let fcmToken = null;
    try {
      fcmToken = await requestNotificationPermission();
    } catch (err) {
      setStatus("error");
      setErrorMsg(`FCM error: ${err?.message ?? err}`);
      return;
    }

    if (!fcmToken) {
      setStatus("error");
      setErrorMsg("Could not get FCM token. Check VAPID key in frontend/.env");
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/devices/register`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:     userId,
          token:       fcmToken,
          platform:    "web",
          device_name: navigator.userAgent.slice(0, 80),
        }),
      });
      if (!res.ok) {
        const e = await res.json();
        throw new Error(e.detail ?? `HTTP ${res.status}`);
      }

      localStorage.setItem(LS_KEY, JSON.stringify({ userId, token: fcmToken }));
      setToken(fcmToken);
      setRegUserId(userId);
      setStatus("registered");
      if (onReady) onReady();

    } catch (err) {
      setStatus("error");
      setErrorMsg(`Backend error: ${err.message}`);
    }
  };

  // ── UI ─────────────────────────────────────────────────────────────────────
  return (
    <div style={styles.wrap}>

      {/* Already registered for THIS userId */}
      {isRegisteredForMe && (
        <div style={{ color: "#22c55e", fontSize: 13, fontWeight: 600 }}>
          ✅ Notifications enabled
          <div style={{ color: "#475569", fontSize: 11, marginTop: 4, fontFamily: "monospace", wordBreak: "break-all" }}>
            {token?.slice(0, 40)}…
          </div>
        </div>
      )}

      {/* Registered for a DIFFERENT userId */}
      {isRegisteredForOther && (
        <>
          <div style={{ color: "#f59e0b", fontSize: 13, marginBottom: 8 }}>
            ⚠️ Device is registered for <code style={styles.code}>{regUserId}</code>.
            Switch to <strong>{userId}</strong>?
          </div>
          <button onClick={handleEnable} style={styles.btn}>Enable for {userId}</button>
        </>
      )}

      {/* Not registered at all */}
      {status === "idle" && (
        <>
          <div style={{ color: "#94a3b8", fontSize: 13, marginBottom: 8 }}>
            🔕 Notifications not enabled
          </div>
          <button onClick={handleEnable} style={styles.btn}>Enable Notifications</button>
        </>
      )}

      {(status === "requesting" || status === "registering") && (
        <span style={{ color: "#94a3b8", fontSize: 13 }}>
          ⏳ {status === "requesting" ? "Waiting for permission…" : "Registering device…"}
        </span>
      )}

      {status === "denied" && (
        <div>
          <div style={{ color: "#ef4444", fontSize: 13, marginBottom: 4 }}>🚫 Notifications blocked</div>
          <div style={{ color: "#64748b", fontSize: 12 }}>
            Click 🔒 in address bar → Notifications → Allow → reload.
          </div>
        </div>
      )}

      {status === "error" && (
        <div>
          <div style={{ color: "#f97316", fontSize: 13, marginBottom: 6 }}>⚠️ {errorMsg}</div>
          <button onClick={handleEnable} style={{ ...styles.btn, background: "#475569" }}>Retry</button>
        </div>
      )}

    </div>
  );
}

const styles = {
  wrap: { background: "#1e293b", borderRadius: 8, padding: "12px 16px", fontSize: 14, color: "#cbd5e1" },
  btn:  { padding: "7px 16px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", fontWeight: 600, fontSize: 13 },
  code: { fontFamily: "monospace", background: "#0f172a", padding: "1px 5px", borderRadius: 4 },
};
