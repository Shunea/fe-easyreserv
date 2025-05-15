/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.6.0/firebase-messaging-compat.js');

const firebaseConfig = {
  // Your Firebase config here
  apiKey: "AIzaSyCfm3VsDf--D3bl4MSkZFJIsIv8g_BRcdA",
  authDomain: "easyreserv-89724.firebaseapp.com",
  projectId: "easyreserv-89724",
  storageBucket: "easyreserv-89724.appspot.com",
  messagingSenderId: "90936697430",
  appId: "1:90936697430:web:fa91b22538d6eac5ee51f7"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging(app);

// Service worker registration
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("ServiceWorker registration successful:", registration);
    })
    .catch((error) => {
      console.error("ServiceWorker registration failed:", error);
    });
}
// Handle background messages
messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
