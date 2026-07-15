/**
 * firebase-messaging-sw.js
 *
 * Works with DATA-ONLY FCM messages (no notification field in backend).
 * This guarantees the SW always controls the notification and
 * data is always available in the notificationclick handler.
 *
 * Handles:
 *  1. onBackgroundMessage → showNotification (background + foreground via postMessage)
 *  2. message event (SHOW_NOTIFICATION) → showNotification for foreground
 *  3. notificationclick → navigate to correct screen
 */

importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey:            "AIzaSyAqrfucMUuy5v1bUWof5ZKbZKkQrHBsk40",
  authDomain:        "naveen-bc7a8.firebaseapp.com",
  projectId:         "naveen-bc7a8",
  storageBucket:     "naveen-bc7a8.firebasestorage.app",
  messagingSenderId: "727882998905",
  appId:             "1:727882998905:web:76323826671b5d4f8520a8",
});

const messaging = firebase.messaging();

// ── 1. Background push ────────────────────────────────────────────────────────
// With data-only messages, this ALWAYS fires (tab open or closed).
messaging.onBackgroundMessage((payload) => {
  console.log("[SW] onBackgroundMessage:", payload);
  const data  = payload.data ?? {};
  // title and body are sent inside the data field since there's no notification field
  const title = data.title ?? "New Notification";
  const body  = data.body  ?? "";
  doShowNotification(title, body, data);
});

// ── 2. Foreground: triggered via postMessage from firebase.js ─────────────────
self.addEventListener("message", (event) => {
  if (event.data?.type === "SHOW_NOTIFICATION") {
    const { title, body, data } = event.data;
    doShowNotification(title, body, data ?? {});
  }
});

// ── 3. Click → navigate ───────────────────────────────────────────────────────
self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const data       = event.notification.data ?? {};
  const screenName = data.screen_name        ?? "";

  // All values are plain strings (no JSON encoding from backend)
  let path = "/";
  switch (screenName) {
    case "OrderDetail":  path = `/orders/${data.order_id   ?? ""}`;  break;
    case "ChatDetail":   path = `/chats/${data.chat_id     ?? ""}`;  break;
    case "DesignDetail": path = `/designs/${data.design_id ?? ""}`;  break;
  }

  const targetUrl = self.location.origin + path;
  console.log("[SW] notificationclick → navigating to:", targetUrl);

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((wins) => {
        // If a tab is already open, focus + navigate it
        for (const w of wins) {
          if ("navigate" in w) {
            return w.focus().then(() => w.navigate(targetUrl));
          }
        }
        // No tab open — open a new one
        return clients.openWindow(targetUrl);
      })
  );
});

// ── Helper ────────────────────────────────────────────────────────────────────
function doShowNotification(title, body, data) {
  return self.registration.showNotification(title, {
    body,
    icon:     "/logo.png",
    badge:    "/badge.png",
    tag:      "push-notification",
    renotify: true,
    data,     // attached to notification — available in notificationclick
  });
}
