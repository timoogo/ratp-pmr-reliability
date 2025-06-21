"use client";

import { toast } from "sonner";
import { CheckCircle, XCircle, Wrench, Info } from "lucide-react";
import type { SocketEventMap } from "@/types/socket-events";
import { formatFromOptions } from "@/lib/utils";

const displayed = new Set<string>();

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
      const formattedType = formatFromOptions(station.type, { plural: true });

      const location = `/etat-equipement/${
        formatFromOptions(station.family).label
      }/${station.line}/${station.slug}/${formattedType.label}/${equipmentCode}`;

      const key = `${equipmentId}-${status}`;
      if (displayed.has(key)) return;
      displayed.add(key);

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

      setTimeout(() => displayed.delete(key), 10000);
    },

    "history-validated": ({ message }) => {
      toast("Historique validé", {
        description: message,
      });
    },
  };
}
