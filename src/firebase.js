/**
 * firebase.js
 * FCM token + foreground notification handler.
 *
 * For foreground messages: posts a message to the active service worker,
 * which then calls self.registration.showNotification() — this is the only
 * reliable way to show a real OS notification when the tab is focused.
 */

import { initializeApp }             from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
};

const app       = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

/** Get FCM registration token */
export async function requestNotificationPermission() {
  const vapidKey       = import.meta.env.VITE_FIREBASE_VAPID_KEY;
  const swRegistration = await navigator.serviceWorker.ready;
  const token = await getToken(messaging, {
    vapidKey,
    serviceWorkerRegistration: swRegistration,
  });
  return token ?? null;
}

/**
 * Foreground message listener.
 *
 * When the tab is focused, Firebase suppresses the OS notification.
 * We fix this by sending a postMessage to the SW with type "SHOW_NOTIFICATION".
 * The SW receives it and calls self.registration.showNotification() — which
 * always works because it runs in the SW context, not the page context.
 */
export function setupForegroundNotifications() {
  return onMessage(messaging, async (payload) => {
    console.log("[FCM] Foreground message received:", payload);

    const title = payload.notification?.title ?? "New Notification";
    const body  = payload.notification?.body  ?? "";
    const data  = payload.data ?? {};

    // Post to the active SW — it will call showNotification
    if ("serviceWorker" in navigator) {
      const swReg = await navigator.serviceWorker.ready;
      if (swReg.active) {
        swReg.active.postMessage({
          type:  "SHOW_NOTIFICATION",
          title,
          body,
          data,
        });
      }
    }
  });
}

export { messaging };
