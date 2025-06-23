// Fichier: config/websocket-listeners.ts

import { toast } from "sonner";
import { CheckCircle, XCircle, Wrench, Info } from "lucide-react";
import type { SocketEventMap } from "@/types/socket-events";
import { formatFromOptions } from "@/lib/utils";

const displayed = new Set<string>();

// Variable globale interne
let subscriptions: Record<string, { types: string[]; frequency: string }> = {};

// Setter appelé depuis StationStepperWithAccordion
export function setGlobalSubscriptions(
  newSubscriptions: Record<string, { types: string[]; frequency: string }>
) {
  subscriptions = newSubscriptions;
}


function canDisplayNotification(key: string, frequency: string): boolean {
  if (frequency === "IMMEDIATE") return true;
  if (frequency === "DAILY") {
    try {
      const lastShownStr = localStorage.getItem(`notif-${key}`);
      if (lastShownStr) {
        const lastShown = new Date(lastShownStr);
        const now = new Date();
        const diffMs = now.getTime() - lastShown.getTime();
        if (diffMs < 24 * 60 * 60 * 1000) return false;
      }
      localStorage.setItem(`notif-${key}`, new Date().toISOString());
      return true;
    } catch {
      return true;
    }
  }
  return true;
}

export function getGlobalSocketListeners(): {
  [K in keyof SocketEventMap]?: (payload: SocketEventMap[K]) => void;
} {
  return {
    "equipment-status-updated": ({
      label,
      station,
      status,
      equipmentId,
      equipmentCode,
    }) => {
      console.log("incoming:", {
        label,
        station,
        status,
        equipmentId,
        equipmentCode,
      });
      
      const sub = subscriptions[station.slug];
      if (!sub) return;

      const equipmentType = station.type;
      if (!sub.types.includes(equipmentType)) return;

      const key = `${equipmentId}-${status}`;
      if (displayed.has(key)) return;
      if (!canDisplayNotification(key, sub.frequency)) return;

      displayed.add(key);
      setTimeout(() => displayed.delete(key), 10000);

      const formattedType = formatFromOptions(equipmentType, { plural: true });
      const location = `/etat-equipement/${formatFromOptions(station.family).label}/${station.line}/${station.slug}/${formattedType.label}/${equipmentCode}`;

      const icon = {
        DISPONIBLE: <CheckCircle className="text-green-600 w-5 h-5" />,
        INDISPONIBLE: <XCircle className="text-red-600 w-5 h-5" />,
        EN_MAINTENANCE: <Wrench className="text-yellow-600 w-5 h-5" />,
      }[status] ?? <Info className="text-gray-600 w-5 h-5" />;

      toast(`${label} à ${station.name}`, {
        description: `Statut : ${status}`,
        icon,
        action: {
          label: "Voir la station",
          onClick: () => {
            window.location.href = location;
          },
        },
      });
    },
  };
}
