import { EquipmentDetail } from "./elevator";
import { Station } from "./station";

export type StationWithEquipments = Station & {
    equipments: EquipmentDetail[];
  };
  