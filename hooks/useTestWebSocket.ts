"use client";

import { useEffect } from "react";
import { socket } from "@/utils/socket";

export function useTestWebSocket() {
  useEffect(() => {

    socket.on("connect", () => {
      console.log("✅ Connecté au serveur WebSocket");
    });

    socket.on("equipment-status-updated", (data) => {
      console.log("📡 Incident reçu :", data);
      alert(`Incident à ${data.station} : ${data.label} est ${data.status}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
    