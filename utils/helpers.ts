import { Equipment } from "@prisma/client";

type EquipmentLike = {
    type: string;
    status: string;
    updatedAt: string | Date;
  };
  


function getStationStatus(equipments: EquipmentLike[]): "DISPONIBLE" | "PARTIEL" | "INDISPONIBLE" {
    const total = equipments.length;
    const available = equipments.filter(e => e.status === "DISPONIBLE").length;
  
    if (available === total) return "DISPONIBLE";
    if (available === 0) return "INDISPONIBLE";
    return "PARTIEL";
  }
  
  function getSummaryByType(equipments: EquipmentLike[]) {
    const result: Record<string, { available: number; total: number }> = {};
    for (const eq of equipments) {
      if (!result[eq.type]) result[eq.type] = { available: 0, total: 0 };
      result[eq.type].total += 1;
      if (eq.status === "DISPONIBLE") result[eq.type].available += 1;
    }
    return result;
  }
  
  function getLastUpdate(equipments: EquipmentLike[]) {
    return equipments
      .map((e) => new Date(e.updatedAt).getTime())
      .sort((a, b) => b - a)[0];
  }
  
  export { getStationStatus, getSummaryByType, getLastUpdate };