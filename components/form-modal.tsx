"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  equipmentId: string;
  onIncidentReported: () => void;
};

export function ReportIncidentDialog({
  open,
  onOpenChange,
  equipmentId,
  onIncidentReported,
}: Props) {
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
