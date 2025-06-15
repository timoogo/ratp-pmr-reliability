import { Equipment } from "./elevator";

export type Station = {
  stationOrder: number;
  line: string;
  lineSymbol: "M" | "RER" | "T";
  name: string;
  slug: string;
  status: "ok" | "warning" | "current";
  family: "metro" | "rer" | "tramway" | "bus";
  code: string;
  equipments: Equipment[]; // ✅ ici, pas PrismaEquipmentType[]
  createdAt: Date;
  updatedAt: Date;
};

