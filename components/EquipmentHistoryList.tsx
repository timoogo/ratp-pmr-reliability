"use client";
import { cn } from "@/lib/utils";
import { EquipmentStatus } from "@prisma/client";
import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";
import { useEffect, useState } from "react";
import { GenericItemCard } from "./GenericItemCard";
import { Badge } from "./ui/badge";

type Props = {
  equipmentId: string;
};

type EquipmentHistory = {
  id: string;
  status: EquipmentStatus;
  comment: string | null;
  createdAt: string;
};

function formatStatus(status: EquipmentStatus): string {
  switch (status) {
    case EquipmentStatus.DISPONIBLE:
      return "Disponible";
    case EquipmentStatus.INDISPONIBLE:
      return "Indisponible";
    case EquipmentStatus.EN_MAINTENANCE:
      return "En maintenance";
    default:
      return "Inconnu";
  }
}

function getStatusColor(status: EquipmentStatus): string {
  switch (status) {
    case "DISPONIBLE":
      return "bg-green-500";
    case "INDISPONIBLE":
      return "bg-red-500";
    case "EN_MAINTENANCE":
      return "bg-yellow-500";
    default:
      return "bg-gray-400";
  }
}

type GroupedHistory = {
  status: EquipmentStatus;
  count: number;
  createdAt: string;
  items: EquipmentHistory[];
};

function groupHistories(histories: EquipmentHistory[]): GroupedHistory[] {
  if (!histories.length) return [];

  const result: GroupedHistory[] = [];
  let currentGroup: GroupedHistory = {
    status: histories[0].status,
    count: 1,
    createdAt: histories[0].createdAt,
    items: [histories[0]],
  };

  for (let i = 1; i < histories.length; i++) {
    const h = histories[i];
    if (h.status === currentGroup.status) {
      currentGroup.count++;
      currentGroup.items.push(h);
    } else {
      result.push(currentGroup);
      currentGroup = {
        status: h.status,
        count: 1,
        createdAt: h.createdAt,
        items: [h],
      };
    }
  }
  result.push(currentGroup);
  return result;
}

function getStatusIcon(status: EquipmentStatus) {
  switch (status) {
    case "DISPONIBLE":
      return <CheckCircle className="w-4 h-4 text-green-600" />;
    case "INDISPONIBLE":
      return <AlertTriangle className="w-4 h-4 text-red-600" />;
    case "EN_MAINTENANCE":
      return <Wrench className="w-4 h-4 text-yellow-600" />;
    default:
      return null;
  }
}

export function EquipmentHistoryList({ equipmentId }: Props) {
  const [histories, setHistories] = useState<EquipmentHistory[]>([]);

  const grouped = groupHistories(histories);

  useEffect(() => {
    fetch(`/api/equipment/${equipmentId}/histories`)
      .then((res) => res.json())
      .then(setHistories);
  }, [equipmentId]);

  if (!histories.length) {
    return (
      <p className="text-muted-foreground text-sm">
        Aucun historique disponible.
      </p>
    );
  }
  return (
    <ol className="relative ml-4 border-l-2 border-gray-200">
      {grouped.map((group, index) => (
        <li
          key={`${group.status}-${index}`}
          className="relative pl-6 pb-6 last:pb-0"
        >
          <span
            className={cn(
              "absolute left-[-8px] top-1 w-4 h-4 rounded-full border-2 shadow-sm",
              getStatusColor(group.status)
            )}
          />

          <GenericItemCard
            item={group}
            title={`Détail des ${group.count} changement(s) "${formatStatus(
              group.status
            )}"`}
            renderSummary={(item) => (
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className="font-medium">{formatStatus(item.status)}</span>
                {item.count > 1 && (
                  <Badge variant="secondary" title="Voir les détails">
                    Signalé {item.count} fois
                  </Badge>
                )}

                <Badge variant="info">
                  {new Date(item.createdAt).toLocaleString("fr-FR")}
                </Badge>
              </div>
            )}
            renderDetails={(item) => (
              <ul className="space-y-2">
                {item.items.map((h, i) => (
                  <li key={h.id}>
                    <p>
                      <strong>{formatStatus(h.status)}</strong> —{" "}
                      {new Date(h.createdAt).toLocaleString("fr-FR")}
                    </p>
                    {h.comment && <p className="text-sm">{h.comment}</p>}
                  </li>
                ))}
              </ul>
            )}
          />
        </li>
      ))}
    </ol>
  );
}
