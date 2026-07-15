/**
 * pages/DesignDetail.jsx
 * Navigated to when a notification with screen_name="DesignDetail" is tapped.
 * URL: /designs/:designId
 */

import { useParams, Link } from "react-router-dom";

export default function DesignDetail() {
  const { designId } = useParams();

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>← Back to Home</Link>

      <div style={styles.card}>
        <div style={styles.icon}>🎨</div>
        <h1 style={styles.title}>Design Detail</h1>
        <p style={styles.subtitle}>You arrived here via a push notification</p>

        <div style={styles.badge}>screen_name: DesignDetail</div>

        {/* Mock design preview */}
        <div style={styles.preview}>
          <div style={styles.previewCanvas}>
            <div style={styles.shape1} />
            <div style={styles.shape2} />
            <div style={styles.shape3} />
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Design ID</span>
            <span style={styles.infoValue}>{designId ?? "—"}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Status</span>
            <span style={{ ...styles.infoValue, color: "#f59e0b" }}>In Review</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Last Updated</span>
            <span style={styles.infoValue}>Today</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Version</span>
            <span style={styles.infoValue}>v3</span>
          </div>
        </div>

        <div style={styles.note}>
          ℹ️ In a real app this page would fetch design assets using the{" "}
          <code>design_id</code> from the notification payload.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container:     { maxWidth: 600, margin: "0 auto", padding: "20px 0" },
  back:          { color: "#6366f1", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 },
  card:          { background: "#1e293b", borderRadius: 12, padding: "32px 28px", textAlign: "center" },
  icon:          { fontSize: 52, marginBottom: 12 },
  title:         { fontSize: 24, fontWeight: 700, color: "#f1f5f9", margin: "0 0 6px" },
  subtitle:      { color: "#94a3b8", fontSize: 14, marginBottom: 20 },
  badge:         {
    display: "inline-block", background: "#0f172a", color: "#f59e0b",
    borderRadius: 6, padding: "4px 12px", fontSize: 12,
    fontFamily: "monospace", marginBottom: 24,
  },
  preview:       { background: "#0f172a", borderRadius: 10, padding: 20, marginBottom: 24 },
  previewCanvas: { height: 120, position: "relative" },
  shape1:        {
    position: "absolute", width: 80, height: 80, borderRadius: "50%",
    background: "linear-gradient(135deg,#6366f1,#8b5cf6)", top: 10, left: "20%",
  },
  shape2:        {
    position: "absolute", width: 60, height: 60, borderRadius: 8,
    background: "linear-gradient(135deg,#f59e0b,#ef4444)", top: 30, left: "50%",
  },
  shape3:        {
    position: "absolute", width: 50, height: 50, borderRadius: "50%",
    background: "linear-gradient(135deg,#22c55e,#06b6d4)", top: 15, right: "15%",
  },
  infoGrid:      { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 24, textAlign: "left" },
  infoItem:      { background: "#0f172a", borderRadius: 8, padding: "14px 16px" },
  infoLabel:     { display: "block", color: "#64748b", fontSize: 12, marginBottom: 4 },
  infoValue:     { color: "#e2e8f0", fontWeight: 600, fontSize: 16 },
  note:          { background: "#0f172a", borderRadius: 8, padding: "12px 16px", color: "#94a3b8", fontSize: 13, textAlign: "left" },
};
