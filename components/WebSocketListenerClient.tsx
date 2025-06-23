"use client";

import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/toast-utils";

type IncidentPayload = {
  station: {
    name: string;
    slug: string;
    line: string;
    family: string;
    code: string;
    type: string;
  };
  label: string;
  equipmentId: string;
  equipmentCode: string;
  status: "DISPONIBLE" | "INDISPONIBLE" | "EN_MAINTENANCE" | string;
};

export function WebSocketListenerClient() {
  useEffect(() => {
    socket.on("equipment-status-updated", (incoming: IncidentPayload) => {
      console.log("📩 equipment-status-updated reçu :", incoming);

      const { station, label, status, equipmentCode } = incoming;
      const options = getToastOptions(status);

      // 🔗 Génère le lien vers la page de l’équipement
      const formattedFamily = station.family.toLowerCase().replace(/\s+/g, "-");
      const formattedType = station.type.toLowerCase();
      const url = `/etat-equipement/${formattedFamily}/${station.line}/${station.slug}/${formattedType}/${equipmentCode}`;

      toast(`${label} à ${station.name}`, {
        icon: options.icon,
        description: `Statut : ${status}`,
        action: {
          label: "Voir",
          onClick: () => window.location.href = url,
        },
        className: options.className,
      });
    });

    return () => {
      socket.off("equipment-status-updated");
    };
  }, []);

  return null;
}
