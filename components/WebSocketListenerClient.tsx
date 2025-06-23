"use client";

import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { toast } from "sonner";
import { CheckCircle, XCircle, Wrench, Info } from "lucide-react";
import { getToastOptions } from "@/utils/toast-utils";

type IncidentPayload = {
  station: {
    name: string;
    slug: string;
  };
  label: string;
  equipmentId: string;
  status: "DISPONIBLE" | "INDISPONIBLE" | "EN_MAINTENANCE" | string;
};

    

export function WebSocketListenerClient() {
  useEffect(() => {
    socket.on("equipment-status-updated", (incoming: IncidentPayload) => {
      console.log("📩 equipment-status-updated reçu :", incoming);

      const { station, label, status } = incoming;
      const options = getToastOptions(status);

      toast(
        `${label} à ${station.name}`,
        {
          icon: options.icon,
          description: `Statut : ${status}`,
        }
      );
    });

    return () => {
      socket.off("equipment-status-updated");
    };
  }, []);

  return null;
}
