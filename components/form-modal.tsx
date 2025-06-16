"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { EquipmentHistoryWithPending } from "@/types/equipement";
import { EquipmentStatus } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";




interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  onIncidentReported: () => void;
  onIncidentAdded?: (item: EquipmentHistoryWithPending) => void;
  newStatus: EquipmentStatus;
}

export function ReportIncidentDialog({
  open,
  onOpenChange,
  equipmentId,
  onIncidentReported,
  onIncidentAdded,
  newStatus,
}: Props) {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<EquipmentStatus>(newStatus);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, equipmentId }),
      });

      if (!res.ok) {
        toast.error("Erreur lors de l'envoi du signalement");
        throw new Error("Erreur lors de l'envoi du signalement");
      }

      const newIncident = await res.json();

      onIncidentReported();

      const historyRes = await fetch(
        `/api/equipment/${equipmentId}/histories`
      );
      const histories: EquipmentHistoryWithPending[] = await historyRes.json();

      const mostRecent = histories
        .filter((h) => h.pending)
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
        )[0];

      if (mostRecent) onIncidentAdded?.(mostRecent);

      setDescription("");
      onOpenChange(false);
      toast.success("Signalement envoyé avec succès", {
        description: "Votre signalement a bien été pris en compte",
        duration: 5000,

      });
    } catch (error) {
      console.error(error);
      alert("Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Signaler un incident</DialogTitle>
          </DialogHeader>
          <Textarea
            className="w-full mt-4"
            rows={5}
            placeholder="Décrivez l'incident constaté"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          />
<Select value={selectedStatus} onValueChange={(value) => setSelectedStatus(value as EquipmentStatus)}>
  <SelectTrigger className="w-full" id="status">
    <SelectValue placeholder="Sélectionner un statut" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value={EquipmentStatus.INDISPONIBLE}>Indisponible</SelectItem>
    <SelectItem value={EquipmentStatus.EN_MAINTENANCE}>En maintenance</SelectItem>
    <SelectItem value={EquipmentStatus.DISPONIBLE}>Disponible</SelectItem>
  </SelectContent>
</Select>

          


          <DialogFooter className="mt-4">
            <Button type="submit" disabled={loading}>
              Envoyer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}     