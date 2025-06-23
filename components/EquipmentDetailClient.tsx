// ✅ components/EquipmentDetailClient.tsx (corrigé)
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
import { IncidentWithEquipmentAndHistories } from "@/types/history";
import { IncidentList } from "./IncidentList";
import { EquipmentTimeline } from "./equipment-timeline";

export type FrontendEquipmentHistory = {
  id: string;
  equipmentId: string;
  status: string;
  comment: string | null;
  createdAt: string;
  date: string;
  pending?: boolean;
};

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
  const [incidents, setIncidents] = useState<
    IncidentWithEquipmentAndHistories[]
  >([]);
  const [equipmentStatus, setEquipmentStatus] = useState<EquipmentStatus>(
    equipmentData.status
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hasReportedIncident, setHasReportedIncident] = useState(false);
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

  const handleValidate = (id: string) => {
    setHistories((prev) =>
      prev.map((h) => (h.id === id ? { ...h, pending: false } : h))
    );
  };

  const INCIDENT_RECENT_THRESHOLD_HOURS = 2;
  const recentIncidents = incidents.filter((incident) => {
    const createdAt = new Date(incident.createdAt).getTime();
    const now = Date.now();
    return (
      (now - createdAt) / (1000 * 60 * 60) <= INCIDENT_RECENT_THRESHOLD_HOURS
    );
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

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">
        {equipmentData.name} – {equipmentData.station.name}
      </h1>

      {hasReportedIncident && (
        <div className="bg-green-100 text-green-800 border border-green-300 rounded-md px-4 py-2 text-sm">
          Merci, votre signalement a bien été pris en compte.
        </div>
      )}

      <ContentCardWrapper>
        <div className="flex items-center gap-2">
          <Badge
            variant="outline"
            className={getStatusColorClass(equipmentStatus)}
          >
            {formatEquipmentStatusLabel(equipmentStatus)}
          </Badge>
          <Button
            className="ml-4"
            variant="secondary"
            onClick={async () => {
              const res = await fetch(`/api/debug/history`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  equipmentId: equipmentData.id,
                  status: equipmentStatus,
                  comment: "Ajout manuel",
                }),
              });

              if (res.ok) {
                const newHistory = await res.json();
                await fetchHistories(); // ou bien setHistories(prev => [...prev, newHistory])
              } else {
                console.error("Erreur lors de l'ajout de l'historique");
              }
            }}
          >
            Ajouter un historique (débug)
          </Button>

          {recentIncidents.length > 1 && (
            <Badge variant="warning" className="text-sm text-carbon-500">
              {recentIncidents.length} usagers ont signalé un incident
              récemment.
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
          <EquipmentTimeline
            histories={histories.map((h) => ({
              ...h,
              createdAt: new Date(h.createdAt).toISOString(),
              date: new Date(h.date).toISOString(),
            }))}
            onValidate={handleValidate}
          />
        </ContentCardWrapper>

        <ContentCardWrapper className="flex-1">
          <h2 className="text-lg font-bold mb-2">Incidents signalés (débug)</h2>
          <p>Ca va dégager dans la version de démo</p>
          <IncidentList incidents={incidents}>
            {/* pour l'incident, on affiche toutes les informations */}
          </IncidentList>
        </ContentCardWrapper>
      </div>

      <ContentCardWrapper>
        <h2 className="text-lg font-bold">Signaler un incident</h2>
        <p>Vous avez constaté un incident sur l'équipement ?</p>
        <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Signaler un incident
        </Button>
        <Button className="ml-4">Recevoir des notifications</Button>
      </ContentCardWrapper>

      <ReportIncidentDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        equipmentId={equipmentData.id}
        onIncidentReported={async () => {}}
        onIncidentAdded={(item) => {
          setHistories((prev) => [...prev, item]);
        }}
        newStatus={equipmentStatus}
      />
    </div>
  );
}
