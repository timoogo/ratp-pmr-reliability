"use client";

import { useEffect } from "react";
import { WebSocketListener } from "@/WebSocketListener";
import { getGlobalSocketListeners } from "@/config/websocket-listeners";
import { useShallowMemoObject } from "@/hooks/useShallowMemoObject";

export function WebSocketListenerClient() {
  const listeners = useShallowMemoObject(getGlobalSocketListeners());

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("✅ SW enregistré :", reg);
        })
        .catch((err) => {
          console.error("❌ Échec SW :", err);
        });
    }
  }, []);

  return <WebSocketListener listeners={listeners} />;
}
