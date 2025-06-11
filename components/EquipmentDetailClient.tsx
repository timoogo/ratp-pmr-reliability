"use client";

import { useState } from "react";
import { Equipment, EquipmentHistory } from "@prisma/client";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperTitle,
} from "@/components/ui/stepper";
import { ReportIncidentDialog } from "@/components/form-modal";

type Props = {
  equipmentData: Equipment & {
    station: any;
    histories: EquipmentHistory[];
    checks: any[];
    repairs: any[];
  };
  maintenanceDuration: number;
};

export default function EquipmentDetailClient({
  equipmentData,
  maintenanceDuration,
}: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const latestHistory = equipmentData.histories?.[0];
  const isMaintenanceOverdue =
    latestHistory &&
    latestHistory.status.toLowerCase().includes("maintenance") &&
    new Date(latestHistory.date).getTime() + maintenanceDuration < Date.now();

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">
        {equipmentData.name} - {equipmentData.station.name}
      </h1>

      <ContentCardWrapper>
        <div className="flex items-center gap-2">
          <p>{equipmentData.status}</p>
          {isMaintenanceOverdue && (
            <Badge variant="destructive">Maintenance dépassée</Badge>
          )}
        </div>
      </ContentCardWrapper>

      <div className="flex flex-row gap-4">
        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold">Historique</h2>
          <Stepper orientation="vertical">
            {equipmentData.histories?.length ? (
              equipmentData.histories.map((history, index) => {
                const date = new Date(history.date);
                const isMaintenance =
                  date.getTime() + maintenanceDuration < Date.now();
                return (
                  <StepperItem key={history.id} step={index + 1}>
                    <StepperTitle className="flex items-center gap-2">
                      {new Intl.DateTimeFormat("fr-FR", {
                        dateStyle: "medium",
                        timeStyle: "short",
                      }).format(date)}
                      {isMaintenance && (
                        <Badge variant="destructive">En maintenance</Badge>
                      )}
                    </StepperTitle>
                    <StepperDescription>{history.status}</StepperDescription>
                  </StepperItem>
                );
              })
            ) : (
              <p className="text-muted-foreground text-sm">
                Aucun historique disponible
              </p>
            )}
          </Stepper>
        </ContentCardWrapper>

        <ContentCardWrapper className="flex-1">
          <p>yo</p>
        </ContentCardWrapper>
      </div>

      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Signaler un incident</h2>
        <p>Vous avez constaté un incident sur l&apos;équipement ?</p>
        <Button onClick={() => setIsOpen(true)}>Signaler un incident</Button>
      </ContentCardWrapper>

      {isOpen && (
        <ReportIncidentDialog
          open={isOpen}
          onOpenChange={setIsOpen}
        />
      )}
    </div>
  );
}
