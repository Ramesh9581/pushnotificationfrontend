/**
 * pages/ChatDetail.jsx
 * Navigated to when a notification with screen_name="ChatDetail" is tapped.
 * URL: /chats/:chatId
 */

import { useParams, Link } from "react-router-dom";

const MOCK_MESSAGES = [
  { id: 1, from: "Alice",  text: "Hey! Your order is being prepared.",  time: "10:02 AM" },
  { id: 2, from: "You",    text: "Thanks! How long will it take?",       time: "10:03 AM" },
  { id: 3, from: "Alice",  text: "Around 30 minutes. We'll notify you.", time: "10:04 AM" },
];

export default function ChatDetail() {
  const { chatId } = useParams();

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.back}>← Back to Home</Link>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.avatar}>💬</div>
          <div>
            <h1 style={styles.title}>Chat</h1>
            <p style={styles.subtitle}>Chat ID: {chatId ?? "—"}</p>
          </div>
          <div style={styles.badge}>screen_name: ChatDetail</div>
        </div>

        <div style={styles.messages}>
          {MOCK_MESSAGES.map((msg) => {
            const isMe = msg.from === "You";
            return (
              <div key={msg.id} style={{ ...styles.msgRow, justifyContent: isMe ? "flex-end" : "flex-start" }}>
                <div style={{ ...styles.bubble, background: isMe ? "#6366f1" : "#0f172a" }}>
                  {!isMe && <div style={styles.msgFrom}>{msg.from}</div>}
                  <div style={styles.msgText}>{msg.text}</div>
                  <div style={styles.msgTime}>{msg.time}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div style={styles.note}>
          ℹ️ In a real app this would load the conversation using the{" "}
          <code>chat_id</code> from the notification payload.
        </div>
      </div>
    </div>
  );
}

const styles = {
  container:  { maxWidth: 600, margin: "0 auto", padding: "20px 0" },
  back:       { color: "#6366f1", textDecoration: "none", fontSize: 14, display: "inline-block", marginBottom: 20 },
  card:       { background: "#1e293b", borderRadius: 12, padding: "24px 24px" },
  header:     { display: "flex", alignItems: "center", gap: 14, marginBottom: 24, flexWrap: "wrap" },
  avatar:     { fontSize: 40 },
  title:      { fontSize: 20, fontWeight: 700, color: "#f1f5f9", margin: 0 },
  subtitle:   { color: "#94a3b8", fontSize: 13, margin: "2px 0 0" },
  badge:      {
    marginLeft: "auto", background: "#0f172a", color: "#22c55e",
    borderRadius: 6, padding: "4px 12px", fontSize: 12, fontFamily: "monospace",
  },
  messages:   { display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 },
  msgRow:     { display: "flex" },
  bubble:     { borderRadius: 10, padding: "10px 14px", maxWidth: "75%" },
  msgFrom:    { color: "#94a3b8", fontSize: 11, marginBottom: 4 },
  msgText:    { color: "#f1f5f9", fontSize: 14 },
  msgTime:    { color: "#64748b", fontSize: 11, marginTop: 4, textAlign: "right" },
  note:       { background: "#0f172a", borderRadius: 8, padding: "12px 16px", color: "#94a3b8", fontSize: 13 },
};
