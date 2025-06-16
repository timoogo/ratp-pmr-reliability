export type FrontendEquipmentHistory = {
    id: string;
    status: string; // ✅ string, car le backend renvoie une string
    comment: string | null;
    createdAt: string; // ✅ ISO string
    pending?: boolean;
  };
  