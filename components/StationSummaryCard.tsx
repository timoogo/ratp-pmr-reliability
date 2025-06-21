"use client";

import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useEffect } from "react";

type StationSummaryCardProps = {
  equipmentByType: Record<string, { total: number; available: number }>;
  lastUpdate: string;
  onUpdate?: (formatted: string) => void;
};

export function StationSummaryCard({
  equipmentByType,
  lastUpdate,
  onUpdate,
}: StationSummaryCardProps) {
  const formattedDate = format(new Date(lastUpdate), "dd/MM/yyyy HH:mm", {
    locale: fr,
  });

  useEffect(() => {
    onUpdate?.(formattedDate);
  }, [formattedDate, onUpdate]);

  return (
    <div className="space-y-2 px-2 py-3">
      <h4 className="text-sm font-semibold text-muted-foreground">
        Types d’équipements présents :
      </h4>
      <ul className="text-sm space-y-1">
        {Object.entries(equipmentByType).map(([type, { available, total }]) => (
          <li key={type} className="flex justify-between">
            <span className="capitalize">{type.toLowerCase()}</span>
            <span className="text-muted-foreground">
              {available} / {total} disponibles
            </span>
          </li>
        ))}
      </ul>

      <p className="text-xs text-muted-foreground pt-2">
        Dernière mise à jour : {formattedDate}
      </p>
    </div>
  );
}
