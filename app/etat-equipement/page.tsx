"use client";

import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  CheckCircle,
  XCircle,
  Wrench,
  Info,
} from "lucide-react";
import Link from "next/link";

export default function EtatEquipement() {
  const handleFakeToast = () => {


    const status = "INDISPONIBLE" as any;
    const label = "Escalator";
    const station = {
      name: "Gare de Lyon",
      family: "metro",
      line: "14",
      code: "ART_IDFM_504767",
      slug: "gare-de-lyon",
    };
    console.log({
      station
    })
    let icon;
    
    switch (status) {
      case "DISPONIBLE":
        icon = <CheckCircle className="text-green-600 w-5 h-5" />;
        break;
      case "INDISPONIBLE":
        icon = <XCircle className="text-red-600 w-5 h-5" />;
        break;
      case "EN_MAINTENANCE":
        icon = <Wrench className="text-yellow-600 w-5 h-5" />;
        break;
      default:
        icon = <Info className="text-gray-600 w-5 h-5" />;
        break;
    }

    toast(`${label} à ${station.name}`, {
      description: `Statut : ${status}`,
      icon,
      action: {
        label: "Voir la station",
        onClick: () => {
        },
      },
    });
  };

  return (
    <ContentCardWrapper>
      <h1>Etat Equipement</h1>
      <Link href="/etat-equipement/metro">Métros</Link>

      <Button onClick={handleFakeToast} className="mt-4">
        send a toast
      </Button>
    </ContentCardWrapper>
  );
}
  