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
import { socket } from "@/utils/socket";
import { EquipmentType } from "@prisma/client";
import { useCallback, useEffect, useState } from "react";
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

  const handleSubscriptionSubmit = useCallback(
    (data: {
      types: string[];
      frequency: "IMMEDIATE" | "DAILY" | "WEEKLY";
    }) => {
      // logique future ici
    },
    []
  );

  // 🔁 Reset lastUpdates quand stations changent (ex : re-fetch)
  useEffect(() => {
    const initialLastUpdates: Record<string, string> = {};
    for (const station of stations) {
      const updatedAt = new Date(getLastUpdate(station.equipments)).toISOString();
      initialLastUpdates[station.slug] = updatedAt;
    }
    setLastUpdates(initialLastUpdates);
  }, [stations]);

  // 🎯 Mise à jour via socket
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
  

  return (
    <Accordion type="multiple" className="w-full space-y-2">
      {stations.map((station) => {
        const total = station.equipments.length;
        const available = station.equipments.filter(
          (e) => e.status === "DISPONIBLE"
        ).length;
        const globalStatus = getStationStatus(station.equipments);
        const summaryByType = getSummaryByType(station.equipments);
        const lastUpdate = new Date(getLastUpdate(station.equipments)).toISOString();

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
                availableTypes={Object.keys(summaryByType) as EquipmentType[]}
                onSubmit={handleSubscriptionSubmit}
              />
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
