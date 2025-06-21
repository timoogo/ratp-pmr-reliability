"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  getLastUpdate,
  getStationStatus,
  getSummaryByType,
} from "@/utils/helpers";
import { onSubscribe } from "@/utils/onSubscribe";
import { socket } from "@/utils/socket";
import { EquipmentType, SubscriptionFrequency } from "@prisma/client";
import { useEffect, useRef, useState } from "react";
import { StationHeader } from "./StationHeader";
import { StationSubscriptionForm } from "./StationSubscriptionForm";
import { StationSummaryCard } from "./StationSummaryCard";

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
  const [lastUpdates, setLastUpdates] = useState<Record<string, string>>({});
  const [subscriptions, setSubscriptions] = useState<
    Record<
      string,
      { types: string[]; frequency: keyof typeof SubscriptionFrequency }
    >
  >({});

  const prevLastUpdates = useRef<Record<string, string>>({});

  // Init lastUpdates uniquement si nécessaire (évite boucle infinie)
  useEffect(() => {
    const next: Record<string, string> = {};
    let changed = false;

    for (const station of stations) {
      const updatedAt = new Date(
        getLastUpdate(station.equipments)
      ).toISOString();
      next[station.slug] = updatedAt;

      if (prevLastUpdates.current[station.slug] !== updatedAt) {
        changed = true;
      }
    }

    if (changed) {
      setLastUpdates(next);
      prevLastUpdates.current = next;
    }
  }, [stations]);

  // Mise à jour via WebSocket (évite boucle infinie)
  useEffect(() => {
    const handler = (data: {
      station: string;
      equipmentId: string;
      status: string;
    }) => {
      setStations((prev) =>
        prev.map((station) => {
          if (station.name !== data.station) return station;

          return {
            ...station,
            equipments: station.equipments.map((eq) =>
              eq.id === data.equipmentId
                ? {
                    ...eq,
                    status: data.status,
                    updatedAt: new Date().toISOString(),
                  }
                : eq
            ),
          };
        })
      );
    };

    socket.on("equipment-status-updated", handler);
    return () => {
      socket.off("equipment-status-updated", handler);
    };
  }, []);
  


  useEffect(() => {
    async function fetchSubscriptions() {
      try {
        const res = await fetch("/api/push-subscriptions");
        if (!res.ok) throw new Error("Erreur réseau");
        const data = await res.json();
        const map = data.reduce((acc: Record<string, { types: string[]; frequency: keyof typeof SubscriptionFrequency }>, sub: { station: string; types: string[]; frequency: keyof typeof SubscriptionFrequency }) => {
          acc[sub.station] = { types: sub.types, frequency: sub.frequency };
          return acc;
        }, {} as Record<string, { types: string[]; frequency: keyof typeof SubscriptionFrequency }>);
        setSubscriptions(map);
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
        const lastUpdate = new Date(
          getLastUpdate(station.equipments)
        ).toISOString();

        const availableTypes = Object.keys(summaryByType) as EquipmentType[];

        return (
          <AccordionItem key={station.slug} value={station.slug}>
            <AccordionTrigger>
              <StationHeader
                station={station}
                available={available}
                total={total}
                status={globalStatus}
                lastUpdate={lastUpdates[station.slug]}
              />
            </AccordionTrigger>
            <AccordionContent className="pl-4 pr-2 border-l">
              <StationSummaryCard
                equipmentByType={summaryByType}
                lastUpdate={lastUpdate}
                onUpdate={(formatted) =>
                  setLastUpdates((prev) => ({
                    ...prev,
                    [station.slug]: formatted,
                  }))
                }
              />
              <StationSubscriptionForm
                stationSlug={station.slug}
                availableTypes={availableTypes}
                initialTypes={subscriptions[station.slug]?.types || []}
                initialFrequency={
                  subscriptions[station.slug]?.frequency || "IMMEDIATE"
                }
                onSubmit={async (data) => {
                  try {
                    await onSubscribe({
                      stationSlug: station.slug,
                      selectedTypes: data.types,
                      frequency: data.frequency,
                    });
                    setSubscriptions((prev) => ({
                      ...prev,
                      [station.slug]: {
                        types: data.types,
                        frequency: data.frequency,
                      },
                    }));
                  } catch (error) {
                    console.error(error);
                    // Toast ou feedback d'erreur possible
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
