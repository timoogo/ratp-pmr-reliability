"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Props<T> = {
  item: T;
  title: string; // Titre générique de la modale
  renderSummary: (item: T) => React.ReactNode;
  renderDetails: (item: T) => React.ReactNode;
};

export function GenericItemCard<T>({ item, title, renderSummary, renderDetails }: Props<T>) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="border p-2 rounded bg-white cursor-pointer hover:bg-gray-50 transition"
        onClick={() => setOpen(true)}
      >
        {renderSummary(item)}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">{renderDetails(item)}</div>
        </DialogContent>
      </Dialog>
    </>
  );
}
