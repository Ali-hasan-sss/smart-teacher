// lib/firebase.ts
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

// Initialize Firebase only if not already initialized
const firebaseApp = !getApps().length
  ? initializeApp({
      apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_SENDER_ID,
      appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    })
  : getApps()[0];

// **Auth**
export const googleAuth = getAuth(firebaseApp);
export const googleProvider = new GoogleAuthProvider();

// **Messaging (client only)**
let messaging: ReturnType<typeof getMessaging> | null = null;
if (typeof window !== "undefined" && "serviceWorker" in navigator) {
  try {
    messaging = getMessaging(firebaseApp);
  } catch (err) {
    console.warn("Firebase messaging not supported:", err);
  }
}

export const requestFirebaseToken = async (): Promise<string | null> => {
  if (!messaging) return null;
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return null;

    const token = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });
    console.log("Firebase token:", token);
    return token;
  } catch (err) {
    console.error("Failed to get Firebase token", err);
    return null;
  }
};

export const registerFirebaseSW = () => {
  if (typeof window === "undefined") return;
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/firebase-messaging-sw.js")
      .then((reg) => console.log("Service Worker registered:", reg.scope))
      .catch(console.error);
  }
};

export const listenToMessages = () => {
  if (!messaging) return;
  onMessage(messaging, (payload) => {
    console.log("New message received:", payload);
  });
};
