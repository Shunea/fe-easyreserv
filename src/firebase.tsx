import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { saveNotificationToken } from "./auth/api/requests";

interface FirebaseNotification {
  notification: {
    title: string;
    body: string;
  };
}

const firebaseConfig = {
  apiKey: "AIzaSyCfm3VsDf--D3bl4MSkZFJIsIv8g_BRcdA",
  authDomain: "easyreserv-89724.firebaseapp.com",
  projectId: "easyreserv-89724",
  storageBucket: "easyreserv-89724.appspot.com",
  messagingSenderId: "90936697430",
  appId: "1:90936697430:web:fa91b22538d6eac5ee51f7",
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

let permissionRequested = false;

export const requestPermission = () => {
  if (!permissionRequested) {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        return getToken(messaging, { vapidKey: messaging["vapidKey"] })
          .then((currentToken) => {
            // TODO: Check 401 error
            return saveNotificationToken(currentToken);
          })
          .catch((err) => {
            console.log(
              "An error occurred when requesting to receive the token.",
              err
            );
          });
      } else {
        console.log("User Permission Denied.");
      }
    });

    permissionRequested = true;
  }
};

requestPermission();

export const onMessageListener = () =>
  new Promise<FirebaseNotification>((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload as FirebaseNotification);
    });
  });
