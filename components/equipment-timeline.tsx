"use client";

import { useEffect, useState } from "react";
import { AccordionCard } from "@/components/ui/accordion-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { FrontendEquipmentHistory } from "@/types/history";
import { EquipmentStatus } from "@prisma/client";
import { AlertTriangle, CheckCircle, Wrench } from "lucide-react";

// Types
type Props = {
  histories: FrontendEquipmentHistory[];
  onValidate?: (id: string) => void;
};

type EquipmentHistory = FrontendEquipmentHistory;

type GroupedHistory = {
  status: EquipmentStatus;
  count: number;
  createdAt: string;
  items: EquipmentHistory[];
};

// Helpers
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

function getStatusConfig(status: EquipmentStatus) {
  switch (status) {
    case "DISPONIBLE":
      return {
        dotColor: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        lineColor: "bg-green-300",
        icon: CheckCircle,
      };
    case "INDISPONIBLE":
      return {
        dotColor: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        lineColor: "bg-red-300",
        icon: AlertTriangle,
      };
    case "EN_MAINTENANCE":
      return {
        dotColor: "bg-yellow-500",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        lineColor: "bg-yellow-300",
        icon: Wrench,
      };
    default:
      return {
        dotColor: "bg-gray-400",
        textColor: "text-gray-700",
        bgColor: "bg-gray-50",
        borderColor: "border-gray-200",
        lineColor: "bg-gray-300",
        icon: CheckCircle,
      };
  }
}

function displaySkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center gap-4">
          <div className="w-16 sm:w-28 md:w-36 h-4 bg-gray-200 rounded" />
          <div className="w-4 h-4 bg-gray-200 rounded-full" />
          <div className="w-8 h-0.5 bg-gray-200" />
          <div className="flex-1 h-12 bg-gray-200 rounded-lg" />
        </div>
      ))}
    </div>
  );
}

function groupAndSortHistories(histories: EquipmentHistory[]): GroupedHistory[] {
  if (!histories.length) return [];

  const result: GroupedHistory[] = [];

  const sorted = [...histories].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const pendingGroups = new Map<EquipmentStatus, EquipmentHistory[]>();
  const confirmed: EquipmentHistory[] = [];

  for (const h of sorted) {
    if (h.pending) {
      const key = h.status as EquipmentStatus;
      if (!pendingGroups.has(key)) pendingGroups.set(key, []);
      pendingGroups.get(key)!.push(h);
    } else {
      confirmed.push(h);
    }
  }

  for (const [status, items] of pendingGroups.entries()) {
    result.push({
      status,
      count: items.length,
      createdAt: items[0].createdAt,
      items,
    });
  }

  if (!confirmed.length) return result;

  let currentGroup: GroupedHistory = {
    status: confirmed[0].status as EquipmentStatus,
    items: [confirmed[0]],
    count: 1,
    createdAt: confirmed[0].createdAt,
  };

  for (let i = 1; i < confirmed.length; i++) {
    const h = confirmed[i];
    if (h.status === currentGroup.status) {
      currentGroup.items.push(h);
      currentGroup.count++;
      if (new Date(h.createdAt) > new Date(currentGroup.createdAt)) {
        currentGroup.createdAt = h.createdAt;
      }
    } else {
      result.push(currentGroup);
      currentGroup = {
        status: h.status as EquipmentStatus,
        items: [h],
        count: 1,
        createdAt: h.createdAt,
      };
    }
  }

  result.push(currentGroup);
  return result;
}

function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  return {
    time: date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
    date: date.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }),
  };
}

// Composant principal

export function EquipmentTimeline({ histories, onValidate }: Props) {
  const [waiting, setWaiting] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setWaiting(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  if (!histories.length) {
    return (
      <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 bg-white">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-6 sm:mb-8">
          Historique
        </h2>
        {waiting ? (
          displaySkeleton()
        ) : (
          <p className="text-muted-foreground text-sm">
            Pas d'historique trouvé pour cet équipement.
          </p>
        )}
      </div>
    );
  }

  const grouped = groupAndSortHistories(histories);

  const handleValidatePending = async (item: EquipmentHistory) => {
    try {
      const res = await fetch(`/api/incident/${item.id}/validate`, {
        method: "POST",
      });

      if (!res.ok) throw new Error("Erreur lors de la validation");

      onValidate?.(item.id);
    } catch (e) {
      console.error(e);
      alert("La validation a échoué");
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-white">
      <div className="relative pl-4 sm:pl-0">
        <div className="absolute left-20 sm:left-32 md:left-40 top-0 bottom-0 w-0.5 bg-gray-300 transform -translate-x-0.5" />

        <div className="space-y-6 sm:space-y-8">
          {grouped.map((group, index) => {
            const config = getStatusConfig(group.status);
            const Icon = config.icon;
            const { time, date } = formatDateTime(group.createdAt);
            const isPending = group.items[0].pending === true;

            return (
              <div key={`group-${group.status}-${index}`} className="relative flex items-start group">
                <div className="w-16 sm:w-28 md:w-36 flex-shrink-0 text-right pr-3 sm:pr-4 md:pr-6">
                  <div className="text-xs sm:text-sm font-semibold text-gray-900 leading-tight">
                    {time}
                  </div>
                  <div className="text-xs text-gray-500 mt-0.5 hidden sm:block">
                    {date}
                  </div>
                </div>

                <div className="relative flex items-center mt-1 ml-2">
                  <div
                    className={cn(
                      "w-3 h-3 sm:w-4 sm:h-4 rounded-full relative z-20 ring-2 sm:ring-3 ring-white shadow-sm",
                      config.dotColor
                    )}
                  />
                </div>

                <div className={cn("w-6 sm:w-8 md:w-12 h-0.5 ml-2 sm:ml-3 mt-2", config.lineColor)} />

                <div className="flex-1 ml-2 sm:ml-3">
                  <AccordionCard
                    value={`details-${index}`}
                    defaultOpen={index === 0}
                    icon={
                      <Icon className={cn("w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0", config.textColor)} />
                    }
                    title={formatStatus(group.status)}
                    badges={
                      <>
                        {group.count > 1 && (
                          <Badge variant="secondary" className="text-xs">
                            {group.status === EquipmentStatus.DISPONIBLE ? "Réparé" : `Signalé ${group.count} fois`}
                          </Badge>
                        )}
                        {index === 0 && (
                          <Badge variant="primary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-200">
                            Actuel
                          </Badge>
                        )}
                        {isPending && (
                          <Badge
                            variant="outline"
                            className="text-gray-500 border-gray-300 bg-white cursor-pointer hover:bg-gray-100"
                            onClick={() => handleValidatePending(group.items[0])}
                          >
                            À valider
                          </Badge>
                        )}
                      </>
                    }
                    className={cn(
                      config.bgColor,
                      config.borderColor,
                      isPending && "border-dashed text-gray-400 bg-gray-50"
                    )}
                  >
                    {group.count > 1 && (
                      <div className="mt-2 space-y-2 text-sm border-t pt-2">
                        {group.items.slice(0, 3).map((item) => {
                          const itemDateTime = formatDateTime(item.createdAt);
                          return (
                            <div key={item.id} className="flex flex-col gap-1">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <span>{itemDateTime.time}</span>
                                <span className="text-gray-400">•</span>
                                <span>{itemDateTime.date}</span>
                              </div>
                              {item.comment && (
                                <p className="text-xs text-gray-700 italic pl-2 border-l-2 border-gray-200">
                                  {item.comment}
                                </p>
                              )}
                            </div>
                          );
                        })}
                        {group.items.length > 3 && (
                          <p className="text-xs text-gray-500 italic">
                            ... et {group.items.length - 3} autre(s) signalement(s)
                          </p>
                        )}
                      </div>
                    )}

                    {group.count === 1 && group.items[0].comment && (
                      <p className="text-xs text-gray-700 italic mt-2 pl-2 border-l-2 border-gray-200">
                        {group.items[0].comment}
                      </p>
                    )}

                    <div className="text-xs text-gray-500 mt-2 sm:hidden pl-3">
                      {date}
                    </div>
                  </AccordionCard>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex items-center mt-6 sm:mt-8">
          <div className="w-16 sm:w-28 md:w-36 flex-shrink-0" />
          <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-gray-400 ring-2 sm:ring-3 ring-white shadow-sm" />
          <div className="w-6 sm:w-8 md:w-12 h-0.5 bg-gray-300 ml-2 sm:ml-3" />
          <div className="flex-1 ml-2 sm:ml-3">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 border border-gray-200">
              <span className="text-xs sm:text-sm text-gray-500 font-medium">
                Début de l'historique
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
