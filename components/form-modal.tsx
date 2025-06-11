// components/ReportIncidentDialog.tsx
"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function ReportIncidentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [description, setDescription] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: appel API ou mutation
    onOpenChange(false);
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
            <Button type="submit">Envoyer le signalement</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
