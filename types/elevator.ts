import { Station } from "@/types/station";

export type EquipmentType = "ASCENSEUR" | "ESCALATOR" | "PORTILLONS" | "CABINE";

export type EquipmentStatus =
  | "Disponible"
  | "Indisponible"
  | "En maintenance"
  | "Hors service";

export type EquipmentDetail = {
  id: string; // identifiant unique si nécessaire
  station: Station; // lien direct vers la station complète
  type: EquipmentType;
  status: EquipmentStatus;
  direction?: string;

  situation: {
    raw?: string;
    levels?: {
      from?: string;
      to?: string;
    };
    description?: string;
    accessPurpose?: string;
    exit?: {
      number?: string;
      street?: string;
    };
  };
};
