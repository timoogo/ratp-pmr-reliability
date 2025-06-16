"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EquipmentHistoryWithPending } from "@/types/equipement";
import { EquipmentStatus } from "@prisma/client";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  onIncidentReported: () => void;
  onIncidentAdded?: (item: EquipmentHistoryWithPending) => void;
};

export function ReportIncidentDialog({
  open,
  onOpenChange,
  equipmentId,
  onIncidentReported,
  onIncidentAdded,
}: Props) {
  console.log("Dialog open:", open);

  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description, equipmentId }),
      });

      if (!res.ok) throw new Error("Erreur lors de l'envoi");

      onOpenChange(false);
      setDescription("");
      onIncidentReported();

      const newIncident: EquipmentHistoryWithPending = {
        id: crypto.randomUUID(),
        status: EquipmentStatus.INDISPONIBLE, // ou renvoyé par l’API
        comment: description,
        createdAt: new Date(),
        equipmentId: equipmentId,
        date: new Date(),
        pending: true,
      };

      onIncidentAdded?.(newIncident);
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’envoi du signalement");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un incident</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="description" className="text-sm font-medium">
              Description de l&apos;incident
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={4}
              className="border border-input rounded-md p-2 resize-none w-full"
              placeholder="Exemple : L’ascenseur est bloqué au niveau -1."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Envoi..." : "Envoyer le signalement"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
