"use client";

import {
  Equipment,
  EquipmentHistory,
  EquipmentStatus,
  IncidentReport,
} from "@prisma/client";
import { useCallback, useEffect, useState } from "react";

import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { ReportIncidentDialog } from "@/components/form-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IncidentList } from "./IncidentList";
import { EquipmentTimeline } from "./equipment-timeline";

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

export type FrontendEquipmentHistory = {
  id: string;
  equipmentId: string;
  status: string;
  comment: string | null;
  createdAt: string; // ISO string
  date: string; // ISO string
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

export default function EquipmentDetailClient({ equipmentData }: Props) {
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus>(
    equipmentData.status
  ); // ✅ statut dynamique
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasReportedIncident, setHasReportedIncident] = useState(false); // ✅ message de confirmation
  const [histories, setHistories] = useState<EquipmentHistory[]>([]);
  const fetchIncidents = useCallback(async () => {
    const res = await fetch(`/api/equipment/${equipmentData.id}/incidents`);
    const data = await res.json();
    setIncidents(data);
  }, [equipmentData.id]);

  const fetchEquipment = useCallback(async () => {
    const res = await fetch(`/api/equipment/${equipmentData.id}`);
    const data = await res.json();
    setEquipmentStatus(data.status);
  }, [equipmentData.id]);

  const INCIDENT_RECENT_THRESHOLD_HOURS = 2;
  const recentIncidents = incidents.filter((incident) => {
    const createdAt = new Date(incident.createdAt).getTime();
    const now = Date.now();
    const diffInHours = (now - createdAt) / (1000 * 60 * 60);
    return diffInHours <= INCIDENT_RECENT_THRESHOLD_HOURS;
  });
  const fetchHistories = useCallback(async () => {
    const res = await fetch(`/api/equipment/${equipmentData.id}/histories`);
    const data = await res.json();
    setHistories(data);
  }, [equipmentData.id]);
  useEffect(() => {
    fetchIncidents();
    fetchHistories();
  }, [fetchIncidents, fetchHistories]);

  console.log(histories);
  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">
        {equipmentData.name} – {equipmentData.station.name}
      </h1>

      {/* ✅ Message de confirmation */}
      {hasReportedIncident && (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded-md px-4 py-2 text-sm">
          Merci, votre signalement a bien été pris en compte.
        </div>
      )}

      <ContentCardWrapper>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getStatusColorClass(equipmentStatus)} // ✅ dynamique
          >
            {formatEquipmentStatusLabel(equipmentStatus)} {/* ✅ dynamique */}
          </Badge>
          <Button
          className="ml-4"
          variant="secondary"
          onClick={async () => {
            const res = await fetch(`/api/incident`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                description: "Ajout manuel",
                equipmentId: equipmentData.id,
              }),
            });

            if (res.ok) {
              const newIncident = await res.json();

              setIncidents((prev) => [...prev, newIncident]);

              const newHistory = {
                id: crypto.randomUUID(), // ou laisse Prisma renvoyer les vrais ids si possible
                equipmentId: equipmentData.id,
                status: EquipmentStatus.INDISPONIBLE,
                comment:
                  "Statut mis à jour automatiquement suite à un signalement",
                date: new Date(),
                createdAt: new Date(), // si ton modèle l’a
              };

              setHistories((prev) => [...prev, newHistory]);
            } else {
              console.error("Erreur lors de l'ajout de l'incident");
            }
          }}
        >
          Ajouter un historique (débug)
        </Button>
          {recentIncidents.length > 1 && (
            <Badge variant="warning" className="text-sm text-carbon-500">
              {recentIncidents.length} usagers ont signalé un incident
              récemment. Nous avons pris connaissance de l'incident.
            </Badge>
          )}

          {equipmentStatus === EquipmentStatus.EN_MAINTENANCE && (
            <Badge variant="destructive">Maintenance dépassée</Badge>
          )}
        </div>
      </ContentCardWrapper>

      <div className="flex flex-row gap-4">
        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold mb-2">Historique</h2>
          {/* <EquipmentHistoryList equipmentId={equipmentData.id} /> */}
          <EquipmentTimeline
            histories={histories.map(
              (h): FrontendEquipmentHistory => ({
                ...h,
                createdAt: new Date(h.createdAt).toISOString(),
                date: new Date(h.date).toISOString(),
              })
            )}
          />
        </ContentCardWrapper>

        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold mb-2">Incidents signalés</h2>
          <IncidentList incidents={incidents} />
        </ContentCardWrapper>
      </div>

      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Signaler un incident</h2>
        <p>Vous avez constaté un incident sur l&apos;équipement ?</p>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Signaler un incident
        </Button>
        <Button className="ml-4">Recevoir des notifications</Button>

        {/* TODO: add a button to add a history manually */}
      </ContentCardWrapper>

      <ReportIncidentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        equipmentId={equipmentData.id}
        onIncidentReported={() => {
          fetchIncidents();
          fetchEquipment(); // ✅ met à jour le statut visible
          setHasReportedIncident(true);
        }}
        onIncidentAdded={(item) => {
          setHistories((prev) => [...prev, item]);
        }}
      />
    </div>
  );
}
