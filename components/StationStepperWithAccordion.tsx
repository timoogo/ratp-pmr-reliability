"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getStationStatus,
  getSummaryByType,
} from "@/utils/helpers";
import { onSubscribe } from "@/utils/onSubscribe";
import { socket } from "@/utils/socket";
import { EquipmentType, Station, SubscriptionFrequency } from "@prisma/client";
import { useEffect, useState } from "react";
import { StationHeader } from "./StationHeader";
import { StationSubscriptionForm } from "./StationSubscriptionForm";
import { StationSummaryCard } from "./StationSummaryCard";
import { setGlobalSubscriptions } from "@/config/websocket-listeners";
import { cn } from "@/lib/utils";

// Nouvelle version de getLastUpdate, sécurisée
function getLastUpdate(equipments: { updatedAt: string }[]): string {
  const latest = Math.max(...equipments.map(e => new Date(e.updatedAt).getTime()));
  return new Date(latest).toISOString();
}

export type StationStepperWithAccordionProps = {
  stations: {
    name: string;
    slug: string;
    line: string;
    family: string;
    equipments: {
      id: string;
      type: string;
      status: string;
      updatedAt: string;
    }[];
  }[];
};

export function StationStepperWithAccordion({
  stations: initialStations,
}: StationStepperWithAccordionProps) {
  const [stations, setStations] = useState(initialStations);
  const [updatedStations, setUpdatedStations] = useState<Set<string>>(new Set());
  const [lastUpdates, setLastUpdates] = useState<Record<string, string>>({});
  const [localsubscriptions, setLocalsubscriptions] = useState<
    Record<string, { types: string[]; frequency: keyof typeof SubscriptionFrequency }>
  >({});

  // Met à jour les lastUpdates à chaque changement d'équipements
  useEffect(() => {
    console.groupCollapsed("🔁 Calcul des lastUpdates");
    const next: Record<string, string> = {};

    for (const station of stations) {
      const updatedAt = getLastUpdate(station.equipments);
      next[station.slug] = updatedAt;
      console.log(`🕒 ${station.slug}:`, updatedAt);
    }

    setLastUpdates(next);
    console.groupEnd();
  }, [stations]);




  function getBackgroundColorForStatus(status: "DISPONIBLE" | "PARTIEL" | "INDISPONIBLE") {
    return status === "DISPONIBLE"
      ? "bg-green-100"
      : status === "PARTIEL"
      ? "bg-yellow-100"
      : "bg-red-100";
  }
  






  // Écoute les mises à jour WebSocket
  useEffect(() => {
    const handler = (data: {
      station: Station;
      equipmentId: string;
      status: string;
    }) => {
      console.group(`📡 WebSocket update: ${data.station}`);
      console.log("ID:", data.equipmentId);
      console.log("Nouveau statut:", data.status);

      setStations((prev) =>
        prev.map((station) => {
          if (station.name !== data.station.name) return station;
          setUpdatedStations((prev) => {
            const next = new Set(prev);
            next.add(station.slug);
            return next;
          });
          
          setTimeout(() => {
            setUpdatedStations((prev) => {
              const next = new Set(prev);
              next.delete(station.slug);
              return next;
            });
          }, 3000);
          const updatedEquipments = station.equipments.map((eq) =>
            eq.id === data.equipmentId
              ? {
                  ...eq,
                  status: data.status,
                  updatedAt: new Date().toISOString(),
                }
              : eq
          );

          console.log("✅ Mise à jour équipements:", updatedEquipments);

          return {
            ...station,
            equipments: updatedEquipments,
          };
        })
      );

      console.groupEnd();
    };

    socket.on("equipment-status-updated", handler);
    return () => {
      socket.off("equipment-status-updated", handler);
    };
  }, []);

  // Récupère les abonnements utilisateur
  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await fetch("/api/push-subscriptions");
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();

        const map = data.reduce(
          (
            acc: Record<string, { types: string[]; frequency: keyof typeof SubscriptionFrequency }>,
            sub: { station: string; types: string[]; frequency: keyof typeof SubscriptionFrequency }
          ) => {
            acc[sub.station] = { types: sub.types, frequency: sub.frequency };
            return acc;
          },
          {}
        );

        setLocalsubscriptions(map);
        setGlobalSubscriptions(map);
      } catch (error) {
        console.error("Erreur lors du chargement des abonnements :", error);
      }
    }

    fetchSubscriptions();
  }, []);

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {stations.map((station) => {
        const total = station.equipments.length;
        const available = station.equipments.filter(
          (e) => e.status === "DISPONIBLE"
        ).length;
        const globalStatus = getStationStatus(station.equipments);
        const summaryByType = getSummaryByType(station.equipments);
        const lastUpdate = getLastUpdate(station.equipments);
        const availableTypes = Object.keys(summaryByType) as EquipmentType[];

        console.group(`🧩 Render Station: ${station.slug}`);
        console.log("Status global:", globalStatus);
        console.log("Available:", available);
        console.log("Last update:", lastUpdates[station.slug]);
        console.groupEnd();

        return (
          <AccordionItem
  key={station.slug}
  value={station.slug}
  className={cn(
    "rounded-md transition-colors duration-300 overflow-hidden",
    updatedStations.has(station.slug) && getBackgroundColorForStatus(globalStatus)
  )}
>

            <AccordionTrigger>
              <StationHeader
                station={station}
                available={available}
                total={total}
                status={globalStatus}
                lastUpdate={lastUpdates[station.slug]}
                isUpdated={updatedStations.has(station.slug)}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-4 pr-2 border-l">
              <StationSummaryCard
                equipmentByType={summaryByType}
                lastUpdate={lastUpdate}
              />
              <StationSubscriptionForm
                stationSlug={station.slug}
                availableTypes={availableTypes}
                initialTypes={localsubscriptions[station.slug]?.types || []}
                initialFrequency={
                  localsubscriptions[station.slug]?.frequency || "IMMEDIATE"
                }
                onSubmit={async (data) => {
                  try {
                    await onSubscribe({
                      stationSlug: station.slug,
                      selectedTypes: data.types,
                      frequency: data.frequency,
                    });
                    setLocalsubscriptions((prev) => ({
                      ...prev,
                      [station.slug]: {
                        types: data.types,
                        frequency: data.frequency,
                      },
                    }));
                  } catch (error) {
                    console.error(error);
                  }
                }}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
