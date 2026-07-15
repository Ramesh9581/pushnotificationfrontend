/**
 * UserPicker.jsx
 * Paginated list of users with active FCM tokens.
 * Fixed height — never grows the page.
 */

import { useState, useEffect, useCallback } from "react";

const API_BASE   = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000";
const PAGE_SIZE  = 5;

export default function UserPicker({ selectedUserId, onSelect }) {
  const [allUsers, setAllUsers] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [page,     setPage]     = useState(0);  // 0-indexed

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch(`${API_BASE}/api/v1/users`);
      const json = await res.json();
      setAllUsers(json.users ?? []);
      setPage(0);
    } catch (e) {
      console.error("[UserPicker]", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const totalPages  = Math.ceil(allUsers.length / PAGE_SIZE);
  const pageUsers   = allUsers.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const canPrev     = page > 0;
  const canNext     = page < totalPages - 1;

  return (
    <div style={styles.wrapper}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>👥 Send To</span>
        <button onClick={fetchUsers} style={styles.refreshBtn}>↻</button>
      </div>

      {/* Body — fixed height container */}
      <div style={styles.body}>
        {loading && <div style={styles.empty}>Loading…</div>}

        {!loading && allUsers.length === 0 && (
          <div style={styles.empty}>
            No users yet. Enter your name + user ID above<br />
            and click <strong>Enable Notifications</strong>.
          </div>
        )}

        {!loading && pageUsers.map((u) => {
          const isSelected = u.user_id === selectedUserId;
          return (
            <div
              key={u.user_id}
              onClick={() => onSelect(u.user_id, u.name)}
              style={{
                ...styles.row,
                background:  isSelected ? "#312e81" : "#0f172a",
                borderColor: isSelected ? "#6366f1" : "#1e293b",
              }}
            >
              <div style={{ ...styles.avatar, background: stringToColor(u.name) }}>
                {u.name.charAt(0).toUpperCase()}
              </div>
              <div style={styles.info}>
                <div style={styles.name}>{u.name}</div>
                <div style={styles.uid}>{u.user_id}</div>
              </div>
              {isSelected && <div style={styles.badge}>✓</div>}
            </div>
          );
        })}
      </div>

      {/* Pagination — only shows when there are multiple pages */}
      {totalPages > 1 && (
        <div style={styles.pagination}>
          <button
            onClick={() => setPage(p => p - 1)}
            disabled={!canPrev}
            style={{ ...styles.pageBtn, opacity: canPrev ? 1 : 0.3 }}
          >
            ‹
          </button>
          <span style={styles.pageInfo}>
            {page + 1} / {totalPages}
            <span style={{ color: "#475569", marginLeft: 6 }}>({allUsers.length} users)</span>
          </span>
          <button
            onClick={() => setPage(p => p + 1)}
            disabled={!canNext}
            style={{ ...styles.pageBtn, opacity: canNext ? 1 : 0.3 }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

/** Deterministic color from a string for avatar background */
function stringToColor(str) {
  const colors = ["#6366f1","#8b5cf6","#ec4899","#f59e0b","#10b981","#3b82f6","#ef4444"];
  let hash = 0;
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
}

const styles = {
  wrapper:    { background: "#1e293b", borderRadius: 10, padding: "12px 14px" },
  header:     { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  title:      { color: "#f1f5f9", fontWeight: 700, fontSize: 15 },
  refreshBtn: { background: "#0f172a", border: "1px solid #334155", color: "#94a3b8", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" },
  body:       { minHeight: 60 },
  empty:      { color: "#475569", fontSize: 13, textAlign: "center", padding: "12px 0", lineHeight: 1.7 },
  row:        { display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 8, border: "1px solid", cursor: "pointer", marginBottom: 6, transition: "background .15s" },
  avatar:     { width: 32, height: 32, borderRadius: "50%", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, flexShrink: 0 },
  info:       { flex: 1, minWidth: 0 },
  name:       { color: "#f1f5f9", fontWeight: 600, fontSize: 14, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  uid:        { color: "#64748b", fontSize: 11, fontFamily: "monospace", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  badge:      { background: "#6366f1", color: "#fff", borderRadius: "50%", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, flexShrink: 0 },
  pagination: { display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 8, paddingTop: 8, borderTop: "1px solid #334155" },
  pageBtn:    { background: "#0f172a", border: "1px solid #334155", color: "#f1f5f9", borderRadius: 6, width: 28, height: 28, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" },
  pageInfo:   { color: "#94a3b8", fontSize: 12 },
};
