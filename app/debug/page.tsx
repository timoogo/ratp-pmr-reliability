"use client";

import { useEffect, useState } from "react";

export default function DebugPage() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    const result = await Notification.requestPermission();
    setPermission(result);
  };

  const sendNotification = async () => {
    const reg = await navigator.serviceWorker.ready;

    await reg.showNotification("🔔 Test local", {
      body: "Ceci est un toast simulé",
      icon: "/icons/icon-192x192.png", // adapte selon ton public/
      badge: "/icons/badge.png",
      tag: "test-local",
      data: {
        url: "http://localhost:3000/station/station-de-test-pour-les-ascenseurs", // test ciblé
      },
    });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>🔧 Debug Notification</h1>
      <p>Permission : <strong>{permission}</strong></p>

      {permission !== "granted" ? (
        <button onClick={requestPermission}>
          🔐 Autoriser les notifications
        </button>
      ) : (
        <button onClick={sendNotification}>
          🚀 Envoyer une notification test
        </button>
      )}
    </div>
  );
}
