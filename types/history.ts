import { EquipmentHistory, IncidentReport } from "@prisma/client";
import { Equipment } from "@prisma/client";
export type FrontendEquipmentHistory = {
    id: string;
    status: string; // ✅ string, car le backend renvoie une string
    comment: string | null;
    createdAt: string; // ✅ ISO string
    pending?: boolean;
  };
  
  export type IncidentWithEquipmentAndHistories = IncidentReport & {
    equipment: Equipment & {
      histories: EquipmentHistory[];
    };
  };