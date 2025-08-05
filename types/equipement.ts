export enum EquipmentStatus {
  DISPONIBLE = "DISPONIBLE",
  INDISPONIBLE = "INDISPONIBLE",
  EN_MAINTENANCE = "EN_MAINTENANCE",
}

export type Equipment = {
  id: string;
  name: string;
  code: string;
  status: EquipmentStatus;
  station: {
    name: string;
  };
};

export type EquipmentHistory = {
  id: string;
  equipmentId: string;
  date: string;
  createdAt: string;
  status: EquipmentStatus;
  comment: string | null;
  pending?: boolean;
};

export type IncidentReport = {
  id: string;
  description: string;
  status: string;
  createdAt: string;
  updatedAt: string;
};

export type EquipmentHistoryWithPending = EquipmentHistory & {
  pending: boolean;
};
export enum EquipmentType {
  ASCENSEUR = "ASCENSEUR",
  ESCALATOR = "ESCALATOR",
  PORTILLONS = "PORTILLONS",
  CABINES = "CABINES",
}
export type Station = {
  name: string;
  slug: string;
  line: string;
  family: string;
  equipments: {
    id: string;
    type: EquipmentType;
    status: EquipmentStatus;
    updatedAt: string;
  }[];
};

export { EquipmentType as EquipmentTypePrisma, SubscriptionFrequency } from "@prisma/client";
