"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { socket } from "@/utils/socket";
import {
  CheckCircle,
  XCircle,
  Wrench,
  Info,
} from "lucide-react";

type IncidentPayload = {
  station: string;
  label: string;
  equipmentId: string;
  status: "DISPONIBLE" | "INDISPONIBLE" | "EN_MAINTENANCE" | string;
};

const getToastOptions = (status: IncidentPayload["status"]) => {
  switch (status) {
    case "DISPONIBLE":
      return { type: "success", icon: <CheckCircle className="text-green-600 w-5 h-5" /> };
    case "INDISPONIBLE":
      return { type: "error", icon: <XCircle className="text-red-600 w-5 h-5" /> };
    case "EN_MAINTENANCE":
      return { type: "warning", icon: <Wrench className="text-yellow-600 w-5 h-5" /> };
    default:
      return { type: "default", icon: <Info className="text-muted-foreground w-5 h-5" /> };
  }
};

export function WebSocketListener() {
  useEffect(() => {

    socket.on("connect", () => {
      console.log("WebSocketListener@socket.on#connect");
    });

    socket.on("disconnect", () => {
      console.log("WebSocketListener@socket.on#disconnect");
    });

    console.log("WebSocketListener@useEffect#onMount");
    socket.on("incident-reported", (data: IncidentPayload) => {
      const { label, station, status } = data;
      const options = getToastOptions(status);

      console.log("WebSocketListener@socket.on#incident-reported", data);
      toast(`${label} à ${station}`, {
        description: `Statut : ${status}`,
        ...options,
      });
    });


    socket.on("history-validated", (data: { message: string }) => {
        toast("Mise à jour validée", {
          description: data.message,
          icon: <CheckCircle className="text-green-600 w-5 h-5" />,
        });
      });
      

    return () => {
      socket.off("incident-reported");
      socket.off("history-validated");
    };
  }, []);

  return null;
}
