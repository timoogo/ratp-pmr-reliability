"use client";

import { useEffect } from "react";
import { socket } from "@/utils/socket";
import { toast } from "sonner";
import { getToastOptions } from "@/utils/toast-utils";
import { formatFromOptions } from "@/lib/utils";

// Payload attendu
type IncidentReportedPayload = {
    stationSlug: string;
    stationName: string;
    stationFamily: string; // ajout
    stationLine: string;   // ajout
    equipmentName: string;
    equipmentCode: string; // ajout
    equipmentType: string;
    status: "DISPONIBLE" | "INDISPONIBLE" | "EN_MAINTENANCE" | string;
  };
  

export function ToastListener() {
  useEffect(() => {
    socket.on("incident_reported", (data: IncidentReportedPayload) => {
      console.log("📩 incident_reported reçu :", data);

      const { stationName, equipmentName, status, equipmentType,  stationSlug, stationFamily, stationLine, equipmentCode } = data;
      const options = getToastOptions(status);
      const formattedFamily = stationFamily.toLowerCase().replace(/\s+/g, "-");
      const formattedType = formatFromOptions(equipmentType).label;
      const url = `/etat-equipement/${formattedFamily}/${stationLine}/${stationSlug}/${formattedType}/${equipmentCode}`;
      
      toast(`${equipmentName} à ${stationName}`, {
        icon: options.icon,
        description: `Statut : ${status}`,
        className: options.className,
        duration: 6000,
        action: {
          label: "Voir",
          onClick: () => {
            const url = `/etat-equipement/${formattedFamily}/${stationLine}/${stationSlug}/${formattedType}/${equipmentCode}`;
            window.location.href = url;
          },
        },
      });
      
    });

    return () => {
      socket.off("incident_reported");
    };
  }, []);

  return null;
}
