import React, { useState, useEffect } from "react";
import { requestPermission, onMessageListener } from "../firebase";
import { ToastContainer, ToastOptions, toast } from "react-toastify";
interface CustomToastOptions extends ToastOptions {
  duration?: number;
}

function Notification() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [notification, setNotification] = useState({ title: "", body: "" });

  useEffect(() => {
    requestPermission();

    const unsubscribe = onMessageListener().then((payload) => {
      setNotification({
        title: payload?.notification?.title,
        body: payload?.notification?.body,
      });

      // toast notification
      toast.success(
        `${payload?.notification?.title}: ${payload?.notification?.body}`,
        {
          duration: 60000,
          position: "bottom-right",
        } as CustomToastOptions
      );
    });

    return () => {
      unsubscribe.catch((err) => console.log("failed: ", err));
    };
  }, []);

  return (
    <div>
      <ToastContainer />
    </div>
  );
}

export default Notification;
