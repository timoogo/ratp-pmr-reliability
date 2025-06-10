import { Station } from "./station";
import { EquipmentType } from "@prisma/client";

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



export type Equipment = {
  id: string;
  name: string;
  code: string;
  type: EquipmentType;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  stationId: string;
};