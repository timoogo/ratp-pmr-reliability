// components/station/StationHeader.tsx
export const StationHeader = ({ line, name, type }: { line: string; name: string, type: string }) => {
    const now = new Date();
    const ts =
      now.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }) +
      " à " +
      now.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  
    return (
      <header className="space-y-1">
        <h1 className="text-2xl font-bold">
          État des {type} du Métro {line} à la station {name}
        </h1>
        <p className="text-muted-foreground text-sm">
          Retrouvez en direct l’état des ascenseurs par ligne. Sélectionnez préalablement une ligne afin
          d’accéder au détail par station.
        </p>
        <p className="text-xs text-muted-foreground">État des équipements le {ts}</p>
      </header>
    );
  };
  