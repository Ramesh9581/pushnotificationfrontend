/**
 * pages/Home.jsx
 * Landing page – shows a welcome message and links to demo screens.
 */

import { Link } from "react-router-dom";

const screens = [
  { label: "Order Detail",  path: "/orders/demo-order-1",   emoji: "📦", color: "#6366f1" },
  { label: "Chat Detail",   path: "/chats/demo-chat-1",     emoji: "💬", color: "#22c55e" },
  { label: "Design Detail", path: "/designs/demo-design-1", emoji: "🎨", color: "#f59e0b" },
];

export default function Home() {
  return (
    <div style={styles.container}>
      <div style={styles.hero}>
        <div style={styles.heroIcon}>🔔</div>
        <h1 style={styles.heroTitle}>Push Notification Service</h1>
        <p style={styles.heroSub}>
          Web push notifications with deep-link screen navigation
        </p>
      </div>

      <h2 style={styles.sectionTitle}>Demo Screens</h2>
      <p style={styles.sectionSub}>
        These are the screens a notification can navigate to when tapped.
      </p>

      <div style={styles.grid}>
        {screens.map((s) => (
          <Link key={s.path} to={s.path} style={{ textDecoration: "none" }}>
            <div style={{ ...styles.card, borderTop: `4px solid ${s.color}` }}>
              <div style={styles.cardEmoji}>{s.emoji}</div>
              <div style={styles.cardLabel}>{s.label}</div>
              <div style={styles.cardPath}>{s.path}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={styles.infoBox}>
        <strong>How it works</strong>
        <ol style={{ margin: "8px 0 0 0", paddingLeft: 20, lineHeight: 1.8 }}>
          <li>Click <strong>Enable Notifications</strong> above and enter your user ID.</li>
          <li>Your FCM token is registered with the backend.</li>
          <li>Use the <strong>Send Notification</strong> panel to push a message to yourself.</li>
          <li>Tap the notification — the browser navigates to the specified screen.</li>
        </ol>
      </div>
    </div>
  );
}

const styles = {
  container:    { maxWidth: 760, margin: "0 auto", padding: "20px 0" },
  hero:         { textAlign: "center", marginBottom: 40 },
  heroIcon:     { fontSize: 56, marginBottom: 12 },
  heroTitle:    { fontSize: 28, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" },
  heroSub:      { color: "#94a3b8", fontSize: 15 },
  sectionTitle: { fontSize: 18, fontWeight: 600, color: "#e2e8f0", margin: "0 0 6px" },
  sectionSub:   { color: "#94a3b8", fontSize: 14, marginBottom: 20 },
  grid:         { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 },
  card:         {
    background: "#1e293b", borderRadius: 10, padding: "20px 16px",
    textAlign: "center", cursor: "pointer",
    transition: "transform .15s",
  },
  cardEmoji:    { fontSize: 36, marginBottom: 10 },
  cardLabel:    { color: "#f1f5f9", fontWeight: 600, fontSize: 15 },
  cardPath:     { color: "#64748b", fontSize: 12, marginTop: 4 },
  infoBox:      {
    background: "#1e293b", borderRadius: 10, padding: "18px 22px",
    color: "#cbd5e1", fontSize: 14, borderLeft: "4px solid #6366f1",
  },
};
