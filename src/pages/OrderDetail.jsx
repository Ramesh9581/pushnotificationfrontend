/**
 * pages/OrderDetail.jsx
 * Navigated to when a notification with screen_name="OrderDetail" is tapped.
 * URL: /orders/:orderId
 */

import { useParams, Link } from "react-router-dom";

export default function OrderDetail() {
  const { orderId } = useParams();

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>← Back to Home</Link>

      <div style={styles.card}>
        <div style={styles.icon}>📦</div>
        <h1 style={styles.title}>Order Detail</h1>
        <p style={styles.subtitle}>You arrived here via a push notification</p>

        <div style={styles.badge}>screen_name: OrderDetail</div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Order ID</span>
            <span style={styles.infoValue}>{orderId ?? "—"}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Status</span>
            <span style={{ ...styles.infoValue, color: "#22c55e" }}>Confirmed ✓</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Items</span>
            <span style={styles.infoValue}>3 items</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Total</span>
            <span style={styles.infoValue}>$149.00</span>
          </div>
        </div>

        <div style={styles.note}>
          ℹ️ In a real app this page would fetch order details using the{" "}
          <code>order_id</code> from the notification payload.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container:  { maxWidth: 600, margin: "0 auto", padding: "20px 0" },
  back:       { color: "#6366f1", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 },
  card:       { background: "#1e293b", borderRadius: 12, padding: "32px 28px", textAlign: "center" },
  icon:       { fontSize: 52, marginBottom: 12 },
  title:      { fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" },
  subtitle:   { color: "#94a3b8", fontSize: 14, marginBottom: 20 },
  badge:      {
    display: "inline-block", background: "#0f172a", color: "#6366f1",
    borderRadius: 6, padding: "4px 12px", fontSize: 12,
    fontFamily: "monospace", marginBottom: 28,
  },
  infoGrid:   { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 28, textAlign: "left" },
  infoItem:   { background: "#0f172a", borderRadius: 8, padding: "14px 16px" },
  infoLabel:  { display: "block", color: "#64748b", fontSize: 12, marginBottom: 4 },
  infoValue:  { color: "#e2e8f0", fontWeight: 600, fontSize: 16 },
  note:       { background: "#0f172a", borderRadius: 8, padding: "12px 16px", color: "#94a3b8", fontSize: 13, textAlign: "left" },
};
