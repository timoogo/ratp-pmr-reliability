"use client";

import { useEffect, useState } from "react";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { StationStepperWithAccordion } from "@/components/StationStepperWithAccordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EquipmentStatus, EquipmentType } from "@prisma/client";
import { IterationCw } from "lucide-react";

type Station = {
  name: string;
  slug: string;
  line: string;
  family: string;
  equipments: {
    id: string;
    type: EquipmentType;
    status: EquipmentStatus;
    updatedAt: string;
  }[];
};

type Props = {
  line: string;
  stations: Station[];
};

const cssForUpdatedDate = (lastUpdate: Date) => {
  const diff = Date.now() - lastUpdate.getTime();
  if (diff < 2000) return "opacity-50 transition-opacity duration-700";
  return "text-muted-foreground";
};

export function LineStatusClient({ line, stations: initial }: Props) {
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [stations, setStations] = useState<Station[]>(initial);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
    setLastUpdate(new Date());
  }, []);

  const refresh = async () => {
    const res = await fetch(
      `/api/stations-by-line/${stations[0].family}/${line}`
    );
    const data = await res.json();
    setStations(data);
    setLastUpdate(new Date());
  };

  if (!hydrated) return null;

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold">
        État des équipements du Métro {line}
      </h1>
      <div className="flex items-center gap-2">
        <p className={cssForUpdatedDate(lastUpdate)}>
          État des équipements le {lastUpdate.toLocaleDateString("fr-FR")} à{" "}
          {lastUpdate.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <IterationCw
                onClick={refresh}
                className="w-4 h-4 cursor-pointer hover:text-primary"
              />
            </TooltipTrigger>
            <TooltipContent>Forcer la mise à jour</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ContentCardWrapper>
        <StationStepperWithAccordion stations={stations} />
      </ContentCardWrapper>
    </div>
  );
}
