"use client";

import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { ReportIncidentDialog } from "@/components/form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Stepper,
  StepperDescription,
  StepperItem,
  StepperTitle,
} from "@/components/ui/stepper";
import {
  Equipment,
  EquipmentHistory,
  EquipmentStatus,
  IncidentReport,
} from "@prisma/client";
import { useEffect, useState } from "react";
import { IncidentList } from "./IncidentList";

type Props = {
  equipmentData: Equipment & {
    station: any;
    histories: EquipmentHistory[];
    incidents: IncidentReport[];
    checks: any[];
    repairs: any[];
  };
  maintenanceDuration: number;
};

// Affiche un label lisible pour l’enum
function formatEquipmentStatusLabel(status: EquipmentStatus): string {
  switch (status) {
    case "DISPONIBLE":
      return "Disponible";
    case "INDISPONIBLE":
      return "Indisponible";
    case "EN_MAINTENANCE":
      return "En maintenance";
    default:
      return "Inconnu";
  }
}

// Donne une classe couleur selon le statut
function getStatusColorClass(status: EquipmentStatus): string {
  switch (status) {
    case "DISPONIBLE":
      return "text-green-600";
    case "INDISPONIBLE":
      return "text-red-600";
    case "EN_MAINTENANCE":
      return "text-yellow-600";
    default:
      return "text-gray-500";
  }
}

export default function EquipmentDetailClient({
  equipmentData,
  maintenanceDuration,
}: Props) {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const latestHistory = equipmentData.histories?.[0];
  const isMaintenanceOverdue =
    latestHistory &&
    latestHistory.status.toLowerCase().includes("maintenance") &&
    new Date(latestHistory.date).getTime() + maintenanceDuration < Date.now();

  const fetchIncidents = async () => {
    const res = await fetch(`/api/equipment/${equipmentData.id}/incidents`);
    const data = await res.json();
    setIncidents(data);
  };

  // Chargement initial
  useEffect(() => {
    fetchIncidents();
  }, []);
  console.log("equipmentData.status:", equipmentData.status);

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">
        {equipmentData.name} - {equipmentData.station.name}
      </h1>

      <ContentCardWrapper>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getStatusColorClass(equipmentData.status)}
          >
            {formatEquipmentStatusLabel(equipmentData.status)}
          </Badge>
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
          <h2 className="text-lg font-bold">Incidents signalés</h2>
          <IncidentList incidents={incidents} />
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
          equipmentId={equipmentData.id}
          onIncidentReported={fetchIncidents}
        />
      )}
    </div>
  );
}
