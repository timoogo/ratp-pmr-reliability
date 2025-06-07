import { EquipmentDetail } from "@/types/elevator";
import { mockStations } from "./stations";

export const mockEquipments: EquipmentDetail[] = [
  {
    id: "MSO-ASC1",
    station: mockStations[0], // Mairie de Saint-Ouen
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      levels: {
        from: "Rue",
        to: "Quai direction Olympiades"
      },
      description: "Hall principal"
    }
  },
  {
    id: "SO-ASC1", 
    station: mockStations[1], // Saint-Ouen
    type: "ASCENSEUR",
    status: "En maintenance",
    situation: {
      raw: "De la voirie aux quais"
    }
  },
  {
    id: "PC-ASC1",
    station: mockStations[2], // Porte de Clichy
    type: "ASCENSEUR",
    status: "Disponible",
    direction: "Vers quais direction Olympiades",
    situation: {
      levels: {
        from: "Niveau -1",
        to: "Quai"
      }
    }
  },
  {
    id: "PCAR-ASC1",
    station: mockStations[3], // Pont Cardinet
    type: "ASCENSEUR", 
    status: "Indisponible",
    situation: {
      raw: "Accès principal vers quais"
    }
  },
  {
    id: "SL-ASC1",
    station: mockStations[4], // Saint-Lazare
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      levels: {
        from: "Hall d'échange",
        to: "Quais"
      }
    }
  },
  {
    id: "MAD-ASC1",
    station: mockStations[5], // Madeleine
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      raw: "Accès principal"
    }
  },
  {
    id: "PYR-ASC1",
    station: mockStations[6], // Pyramides
    type: "ASCENSEUR",
    status: "Hors service",
    situation: {
      levels: {
        from: "Voirie",
        to: "Quai"
      },
      exit: {
        street: "Rue de Rivoli"
      }
    }
  },
  {
    id: "CHA-ASC1",
    station: mockStations[7], // Châtelet
    type: "ASCENSEUR",
    status: "Disponible",
    direction: "Tous quais",
    situation: {
      raw: "Correspondance générale"
    }
  },
  {
    id: "BER-ASC1",
    station: mockStations[8], // Bercy
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      levels: {
        from: "Rue",
        to: "Quai"
      }
    }
  },
  {
    id: "CSE-ASC1",
    station: mockStations[9], // Cour Saint-Emilion
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      raw: "Accès Bercy Village"
    }
  },
  {
    id: "BFM-ASC1",
    station: mockStations[10], // Bibliothèque François Mitterrand
    type: "ASCENSEUR",
    status: "En maintenance",
    situation: {
      levels: {
        from: "Rue",
        to: "Quai"
      },
      exit: {
        street: "Avenue de France"
      }
    }
  },
  {
    id: "OLY-ASC1",
    station: mockStations[11], // Olympiades
    type: "ASCENSEUR",
    status: "Disponible",
    situation: {
      raw: "Accès principal vers tous niveaux"
    }
  }
];
