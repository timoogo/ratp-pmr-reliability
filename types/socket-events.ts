export type SocketEventMap = {
    "equipment-status-updated": {
      station: {
        name: string;
        code: string;
        line: string;
        family: string;
        slug: string;
        type: string; 
      };
      label: string;
      equipmentId: string;
      equipmentCode: string;
      status: "DISPONIBLE" | "INDISPONIBLE" | "EN_MAINTENANCE" | string;
    };
  
    "history-validated": {
      message: string;
    };
  };
  