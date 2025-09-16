// public/firebase-messaging-sw.js
import { initializeApp } from "firebase/app";
import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";

const firebaseConfig = {
  apiKey: "AIzaSyBZpLbp9xgK0an2Pur97Olic9SqSOUwkt8",
  authDomain: "smart-teacher-oman.firebaseapp.com",
  projectId: "smart-teacher-oman",
  messagingSenderId: "356138717258",
  appId: "1:356138717258:web:1389f74c2599758cf1d6b3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Messaging in the service worker
const messaging = getMessaging(app);

// Handle background messages
onBackgroundMessage(messaging, (payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );

  const notificationTitle = payload.notification?.title || "Notification";
  const notificationOptions = {
    body: payload.notification?.body,
    icon: "/favicon.ico",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
