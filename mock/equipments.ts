type EquipmentData = {
  situation: string;
  direction: string;
};

export const stationEquipmentsMap: Record<string, EquipmentData[]> = {
  "Mairie de Saint-Ouen": [
    {
      situation: ` Niveau -4 (quai) : À la fin du quai de la ligne 14 direction Aéroport d'Orly | Niveau -2 (salle d'échange ligne 13) : Dans la salle d'échange de la ligne 14 avec la ligne 13, après les escalators menant à la sortie 5, au niveau des "espaces refuges" | Niveau 0 (Hall) : En entrant dans la gare, au fond à gauche après la fin de la passerelle centrale`,
      direction: "Olympiades",
    },
    {
      situation: `Niveau -4 (quai) : À la fin du quai de la ligne 14 direction Aéroport d'Orly | Niveau -2 (salle d'échange ligne 13) : Dans la salle d'échange de la ligne 14 avec la ligne 13, après les escalators menant à la sortie 5, au niveau des "espaces refuges" | Niveau 0 (Hall) : En entrant dans la gare, au fond à gauche après la fin de la passerelle centrale`,
      direction: "Olympiades",
    },
    {
      situation: `Niveau -4 (quai) : Au début du quai de la ligne 14 direction Saint-Denis | Niveau -2 (salle d'échange ligne 13) : Dans la salle d'échange de la ligne 14 avec la ligne 13, après les escalators menant à la sortie 5, au niveau des "espaces refuges" | Niveau 0 (Hall) : En entrant dans la gare, au fond à droite après la fin de la passerelle centrale`,
      direction: "Saint-Denis Pleyel (correspondance ligne 13)",
    },
    {
      situation: `Niveau -4 (quai) : Au début du quai de la ligne 14 direction Saint-Denis | Niveau -2 (salle d'échange ligne 13) : Dans la salle d'échange de la ligne 14 avec la ligne 13, après les escalators menant à la sortie 5, au niveau des "espaces refuges" | Niveau 0 (Hall) : En entrant dans la gare, au fond à droite après la fin de la passerelle centrale`,
      direction: "Saint-Denis Pleyel (correspondance ligne 13)",
    },
  ],
  //  Saint-Ouen
  "Saint-Ouen": [
    {
      situation: `-4 : quai du M14 direction Saint Ouen -2: permet d'accéder à la salle d'échanges, pour se diriger vers les sorties ou une correspondance.`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `-4 : M14 Saint Ouen -2: salle d'échange`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `-4 : quai du M14 direction Aéroport d'Orly -2: salle d'échanges`,
      direction: "Olympiades",
    },
    {
      situation: `-4 : quai du M14 direction Aéroport d'Orly -2: salle d'échanges`,
      direction: "Olympiades",
    },
    {
      situation: `0 : sortie 2 (Boulevard Victor Hugo) -2: entre RATP`,
      direction: "",
    },
    {
      situation: `0 : sortie 2 (Boulevard Victor Hugo) -2: entre RATP`,
      direction: "",
    },
    {
      situation: `Salle d'échange vers Circulation (correspondance RER C)`,
      direction: "",
    },
  ],
  //  Saint-Denis Pleyel
  "Porte de Clichy": [
    {
      situation: `(Niveau 0) À la sortie 4, Avenue du Cimetière des Batignolles, à droite en entrant après les portiques vers le quai de la ligne 14 direction Saint-Denis| (Niveau -3) Depuis les quais de la ligne 14 au changement avec la ligne 13 et le RER C, à gauche des toilettes | (Niveau -5, Quai) À la fin du quai de la ligne 14 direction Saint-Denis`,
      direction: "Olympiades",
    },
    {
      situation: `(Niveau 0) À la sortie 4, Avenue du Cimetière des Batignolles, à droite en entrant après les portiques vers le quai de la ligne 14 direction Saint-Denis| (Niveau -3) Depuis les quais de la ligne 14 au changement avec la ligne 13 et le RER C, à gauche des toilettes | (Niveau -5, Quai) À la fin du quai de la ligne 14 direction Saint-Denis`,
      direction: "Olympiades",
    },
    {
      situation: `(Niveau 0) À la sortie 4, Avenue du Cimetière des Batignolles, à droite en entrant après les portiques vers le quai de la ligne 14 direction Aéroport d'Orly| (Niveau -3) Depuis les quais de la ligne 14 au changement avec la ligne 13 et le RER C, à droite des toilettes | (Niveau -5, Quai) À la fin du quai de la ligne 14 direction Aéroport d'Orly`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `(Niveau 0) À la sortie 4, Avenue du Cimetière des Batignolles, à droite en entrant après les portiques vers le quai de la ligne 14 direction Aéroport d'Orly| (Niveau -3) Depuis les quais de la ligne 14 au changement avec la ligne 13 et le RER C, à droite des toilettes | (Niveau -5, Quai) À la fin du quai de la ligne 14 direction Aéroport d'Orly`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `(Niveau -3) Dans la salle menant à la sortie 5, Tribunal de Paris, au centre de la cage d’escalier| (Niveau -1) À la sortie 5, Tribunal de Paris, devant les portiques de la sortie`,
      direction: "",
    },
    {
      situation: `(Niveau -3) Dans la salle menant à la sortie 5, Tribunal de Paris, au centre de la cage d’escalier| (Niveau -1) À la sortie 5, Tribunal de Paris, devant les portiques de la sortie`,
      direction: "",
    },
    {
      situation: `(Niveau -3) Dans la salle menant à la sortie 5, Tribunal de Paris, au centre de la cage d’escalier| (Niveau -1) À la sortie 5, Tribunal de Paris, devant les portiques de la sortie`,
      direction: "",
    },
    {
      situation: `(Niveau -3) Dans la salle menant à la sortie 5, Tribunal de Paris, au centre de la cage d’escalier| (Niveau -1) À la sortie 5, Tribunal de Paris, devant les portiques de la sortie`,
      direction: "",
    },
    {
      situation: `À la sortie 5, Tribunal de Paris, avant les portiques d’entrée en face du Photomaton`,
      direction: "",
    },
    {
      situation: `À la sortie 5, Tribunal de Paris, avant les portiques d’entrée en face du Photomaton`,
      direction: "",
    },
  ],
  "Pont Cardinet": [
    {
      situation: `Étage -1 : salle des échanges Étage 0 : sortie 1 (Rue Cardinet)`,
      direction: "",
    },
    {
      situation: `Étage -1 : salle des échanges vers sortie 1 (Rue Cardinet) Étage -3 : quai M14 direction Aéroport d'Orly`,
      direction: "Olympiades",
    },
    {
      situation: `Étage -1 : salle des échanges direction sortie 1 (Rue Cardinet) Étage -3 : quai M14 direction Aéroport d'Orly`,
      direction: "Olympiades",
    },
    {
      situation: `Étage -1 : salle des échanges sortie 1 (Rue Cardinet) Étage -3 : quai M14 direction Saint Denis`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Étage -1 : salle des échanges direction sortie 1 (Rue Cardinet) Étage -3 : quai M14 direction Saint Denis`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Étage -1 : salle des échanges Étage 0 : sortie 1 (Rue Cardinet)`,
      direction: "",
    },
  ],
  "Saint-Lazare": [
    {
      situation: `Au niveau du dôme de la sortie 1, Cour de Rome, à gauche des escalators en sortant ou à droite en entrant`,
      direction: "",
    },
    {
      situation: `(Niveau -5 [quai]) Au milieu du quai de la ligne 14 en direction d'Aéroport d'Orly| (Niveau -4) Devant le 10 de l'horloge au sol dans la salle au-dessus des quais de la ligne 14| (Niveau 0) Cour de Rome`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `(Niveau -5 [quai]) Au milieu du quai de la ligne 14 en direction de Saint-Denis| (Niveau -4) Devant le 5 de l'horloge au sol dans la salle au-dessus des quais de la ligne 14| (Niveau 0) Cour de Rome`,
      direction: "Olympiades",
    },
  ],
  Madeleine: [
    {
      situation: `Etage 0 : En face du point services RATP, après les portiques de contrôle pour aller vers M14 (Saint Denis/ Orly) et M12 direction Aubervilliers. A droite de l'escalier mécanique (EM1) - Etage -1 : Depuis le quai M12 direction Aubervilliers, Sortie vers M14/sorties 1,4,5`,
      direction: "",
    },
    {
      situation: `Etage -2 : Depuis M12, séparation M14 direction Aéroport d'Orly / M14 direction Saint Denis - Etage -3 : tête du quai M14 direction Saint Denis (pour accéder aux sorties 1,4,5)`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Etage -2 : Depuis M12, séparation M14 direction Aéroport d'Orly / M14 direction Saint Denis - Etage -3 : queue du quai M14 direction Aéroport d'Orly (pour accéder aux sorties 1,4,5)`,
      direction: "Olympiades",
    },
    {
      situation: `Depuis le point services RATP Zone jaune, sortie 1 "place de la Madeleine"`,
      direction: "",
    },
  ],
  Pyramides: [
    {
      situation: `Étage 1 : salle d'échange, au dessus des quais M14 Étage 0 : À l'extrémité du quai M14 direction Aéroport d'Orly`,
      direction: "Olympiades",
    },
    {
      situation: `Étage 1 : salle d'échange, au dessus des quais M14 Étage 0 : À l'extrémité du quai M14 direction Saint Denis`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Depuis le quai M14, pour aller en direction des sorties 1 (av. de l'Opera) et 2 (rue de l'échelle)`,
      direction: "",
    },
  ],
  Châtelet: [
    {
      situation: `Mezzanine vers Quai 1`,
      direction: "Olympiades",
    },
    {
      situation: `Mezzanine vers Quai 1`,
      direction: "Olympiades",
    },
    {
      situation: `Mezzanine vers Quai 2`,
      direction: "Mairie de Saint-Ouen",
    },
  ],
  Bercy: [
    {
      situation: `Etage 0 : Au niveau du quai M14 Aéroport d'Orly, vers quais du M6 (Etoile/Nation) et Sortie 2 "Boulevard de Bercy" - Etage 1 : Au milieu de l'espace d'échange du M14`,
      direction: "Olympiades",
    },
    {
      situation: `Etage 0 : Au niveau du quai M14 Saint Denis - Étage 1 : Au sein de l'espace d'échange du M14, vers M6 et Sorties 1 "Place du Bataillon du Pacifique AccorHotels Arena" et 2 "Bd de Bercy"- Étage 2 : Dans la salle d'échange`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Etage 0 : Dans la salle d'échange zone verte (Point Tickets et Poste information RATP), en face des portiques de contrôle vers M14 - Etage 1 : Donne accès la sortie 2 "Boulevard de Bercy"`,
      direction: "",
    },
    {
      situation: `Etage 0 : Depuis les portiques de contrôle zone bleue, pour accéder au quai M14 Aéroport d'Orly - Etage -1 : Au niveau du quai M14 Aéroport d'Orly, vers les sorties 4 "Rue Henri Desgrange" et 6 "Rue de Bercy"`,
      direction: "Olympiades",
    },
    {
      situation: `Etage 0 : Après les portiques de contrôle zone bleue vers M14 Saint Denis - Etage -1 : Sur le quai M14 Direction Saint Denis, vers Gare de Bercy et vers les sorties 4 "Rue Henri Desgrange" et 6 "Rue de Bercy"`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Etage 0 : Au niveau du point information RATP et Tickets Zone bleue (avant les portiques de contrôle) - Étage 1 : Donne accès à la Rue de Bercy`,
      direction: "",
    },
  ],
  "Cour Saint-Emilion": [
    {
      situation: `Étage 0 : salle des échanges au niveau des sorties 1 (Passage Saint-Émilion Bercy-Village) et 2 (Rue de l'Ambroisie Parc de Bercy) Étage -1 : quai du M14 direction Aéroport d'Orly`,
      direction: "Olympiades",
    },
    {
      situation: `Étage 0 : salle des échanges au niveau des sorties 1 et 2 Étage -1 : quai du M14 direction Saint Denis`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Étage 0 : sortie 2 Étage -1 : entrée de la station au niveau du poste de renseignement RATP`,
      direction: "",
    },
  ],

  "Bibliothèque François Mitterrand": [
    {
      situation: `Étage 0 : salle des échanges, à droite après les portiques et niveau des sorties 2 et 3 Étage -1 : quai du M14 direction Saint Denis`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Étage 0 : salle des échanges, à droite après les portiques et niveau des sorties 2 et 3 Étage -1 : quai du M14 direction Aéroport d'Orly`,
      direction: "Olympiades",
    },
    {
      situation: `Étage 0 : salle des échange, au niveau des sorties 1 (Rue du Chevaleret) et 4 (Pont de Tolbiac) Étage 1 : sortie 1 (Rue du Chevaleret) et 4 (Pont de Tolbiac)`,
      direction: "",
    },
    {
      situation: `Étage 0 : salle d'échange, en face du poste de renseignement RATP et de l'enseigne BFM Optique. Étage 1 : sortie 2 et 3`,
      direction: "",
    },
  ],

  Olympiades: [
    {
      situation: `Étage -1: poste de renseignements RATP, pour aller en direction du M14. Étage 0 : sortie 3 (Rue de Tolbiac)`,
      direction: "",
    },
    {
      situation: `Étage -2 : quais du M14 direction Saint Denis Étage -1 : permet d'accéder à la sortie`,
      direction: "Mairie de Saint-Ouen",
    },
    {
      situation: `Étage -2 : quais du M14 direction Aéroport d'Orly -1 : permet d'accéder à la sortie`,
      direction: "Olympiades",
    },
  ],
};
