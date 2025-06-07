import { EquipmentDetail } from "./elevator";

export type Station = {
  line: string;
  lineSymbol: "M" | "RER" | "T";
  name: string;
  slug: string;
  status: "ok" | "warning" | "current";
  family: "metro" | "rer" | "tramway" | "bus";
  code: string;
  equipments: EquipmentDetail[];
};
