"use client";

import {
  Equipment,
  EquipmentHistory,
  EquipmentStatus,
  IncidentReport,
} from "@prisma/client";
import { useEffect, useState } from "react";

import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { ReportIncidentDialog } from "@/components/form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EquipmentHistoryList } from "./EquipmentHistoryList";
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

// Helpers
function formatEquipmentStatusLabel(status: EquipmentStatus): string {
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

function getStatusColorClass(status: EquipmentStatus): string {
  switch (status) {
    case EquipmentStatus.DISPONIBLE:
      return "text-green-600";
    case EquipmentStatus.INDISPONIBLE:
      return "text-red-600";
    case EquipmentStatus.EN_MAINTENANCE:
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
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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

  useEffect(() => {
    fetchIncidents();
  }, []);

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">
        {equipmentData.name} – {equipmentData.station.name}
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
        {/* HISTORIQUE */}
        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold mb-2">Historique</h2>
          <EquipmentHistoryList equipmentId={equipmentData.id} />
        </ContentCardWrapper>

        {/* INCIDENTS */}
        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold mb-2">Incidents signalés</h2>
          <IncidentList incidents={incidents} />
        </ContentCardWrapper>
      </div>

      {/* FORMULAIRE DE SIGNALISATION */}
      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Signaler un incident</h2>
        <p>Vous avez constaté un incident sur l&apos;équipement ?</p>
        <Button
          variant="outline"
          onClick={() => {
            console.log("clicked");
            setIsDialogOpen(true);
          }}
        >
          Signaler un incident
        </Button>

      </ContentCardWrapper>

      <ReportIncidentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        equipmentId={equipmentData.id}
        onIncidentReported={fetchIncidents}
      />
    </div>
  );
}
