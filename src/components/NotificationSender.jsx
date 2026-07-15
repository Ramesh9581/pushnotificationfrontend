/**
 * NotificationSender.jsx
 * Send notification form — no result banner, no logs section.
 */

import { useState, useEffect } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const API_KEY  = import.meta.env.VITE_API_KEY       ?? "";

const SCREEN_OPTIONS = [
  { value: "Home",         label: "🏠 Home" },
  { value: "OrderDetail",  label: "📦 Order Detail",  dataKey: "order_id",  placeholder: "e.g. ORD-001" },
  { value: "ChatDetail",   label: "💬 Chat Detail",   dataKey: "chat_id",   placeholder: "e.g. CHAT-42" },
  { value: "DesignDetail", label: "🎨 Design Detail", dataKey: "design_id", placeholder: "e.g. DES-99"  },
];

export default function NotificationSender({ userId = "" }) {
  const [title,     setTitle]     = useState("Hello from Push Service 👋");
  const [message,   setMessage]   = useState("Tap to open the app.");
  const [screen,    setScreen]    = useState("Home");
  const [dataValue, setDataValue] = useState("");
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState("");

  // Reset data value when screen changes
  useEffect(() => { setDataValue(""); }, [screen]);

  const selectedScreen = SCREEN_OPTIONS.find((s) => s.value === screen);

  const handleSend = async () => {
    if (!userId)  { setError("Select a user from the list above first."); return; }
    if (!title)   { setError("Enter a notification title."); return; }
    if (!message) { setError("Enter a notification message."); return; }
    setError("");
    setLoading(true);

    const data = {};
    if (selectedScreen?.dataKey && dataValue) {
      data[selectedScreen.dataKey] = dataValue;
    }

    try {
      const res = await fetch(`${API_BASE}/api/v1/notifications/send`, {
        method:  "POST",
        headers: { "Content-Type": "application/json", "X-API-Key": API_KEY },
        body: JSON.stringify({
          user_id:     userId,
          title,
          message,
          screen_name: screen,
          data:        Object.keys(data).length ? data : undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.detail ?? "Request failed");
      }
      // No success banner — notification will appear on screen
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.title}>📤 Send Notification</div>

      {/* Selected user badge */}
      {userId ? (
        <div style={styles.targetBadge}>
          Sending to: <strong style={{ color: "#a5b4fc" }}>{userId}</strong>
        </div>
      ) : (
        <div style={styles.noTarget}>↑ Select a user above to send to</div>
      )}

      <div style={styles.form}>
        <label style={styles.label}>Title</label>
        <input
          style={styles.input}
          placeholder="Notification title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label style={styles.label}>Message</label>
        <textarea
          style={{ ...styles.input, height: 64, resize: "vertical" }}
          placeholder="Notification body"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <label style={styles.label}>Navigate to Screen</label>
        <select
          style={styles.input}
          value={screen}
          onChange={(e) => setScreen(e.target.value)}
        >
          {SCREEN_OPTIONS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        {selectedScreen?.dataKey && (
          <>
            <label style={styles.label}>
              {selectedScreen.dataKey}{" "}
              <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span>
            </label>
            <input
              style={styles.input}
              placeholder={selectedScreen.placeholder}
              value={dataValue}
              onChange={(e) => setDataValue(e.target.value)}
            />
          </>
        )}

        {error && <div style={styles.errorMsg}>⚠ {error}</div>}

        <button
          onClick={handleSend}
          disabled={loading || !userId}
          style={{
            ...styles.sendBtn,
            opacity: loading || !userId ? 0.5 : 1,
            cursor:  loading || !userId ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Sending…" : "🚀 Send Notification"}
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrapper:     { background: "#1e293b", borderRadius: 10, padding: "14px 16px" },
  title:       { color: "#f1f5f9", fontWeight: 700, fontSize: 15, marginBottom: 10 },
  targetBadge: { background: "#0f172a", borderRadius: 6, padding: "6px 10px", fontSize: 12, color: "#94a3b8", marginBottom: 10 },
  noTarget:    { color: "#475569", fontSize: 12, marginBottom: 10, fontStyle: "italic" },
  form:        { display: "flex", flexDirection: "column", gap: 8 },
  label:       { color: "#94a3b8", fontSize: 12, fontWeight: 500 },
  input:       { background: "#0f172a", border: "1px solid #334155", borderRadius: 7, color: "#f1f5f9", padding: "8px 12px", fontSize: 14, outline: "none", fontFamily: "inherit", width: "100%" },
  errorMsg:    { color: "#f87171", fontSize: 13, background: "#2d0a0a", borderRadius: 6, padding: "8px 10px" },
  sendBtn:     { marginTop: 4, padding: "11px", background: "#6366f1", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 15, width: "100%", transition: "opacity .2s" },
};
