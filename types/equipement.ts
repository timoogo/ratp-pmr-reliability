import { EquipmentStatus } from "@prisma/client";

export type EquipmentHistoryWithPending = {
    id: string;
    equipmentId: string;
    date: Date;
    createdAt: Date;
    status: EquipmentStatus;
    comment: string | null;
    pending: boolean;
  };
  