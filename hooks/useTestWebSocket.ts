"use client";

import { useEffect } from "react";
import { io } from "socket.io-client";

export function useTestWebSocket() {
  useEffect(() => {
    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log("✅ Connecté au serveur WebSocket");
    });

    socket.on("incident-reported", (data) => {
      console.log("📡 Incident reçu :", data);
      alert(`Incident à ${data.station} : ${data.label} est ${data.status}`);
    });

    return () => {
      socket.disconnect();
    };
  }, []);
}
    