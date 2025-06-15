// IncidentList.tsx
import { IncidentReport } from "@prisma/client";
import { GenericItemCard } from "./GenericItemCard";

export function IncidentList({ incidents }: { incidents: IncidentReport[] }) {
  if (!incidents.length) {
    return <p className="text-muted-foreground text-sm">Aucun signalement récent</p>;
  }

  return (
    <ul className="space-y-2 text-sm">
      {incidents.map((incident) => (
        <li key={incident.id}>
          <GenericItemCard
            item={incident}
            title="Détail de l’incident"
            renderSummary={(i) => (
              <>
                <p className="font-medium">{i.description}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(i.createdAt).toLocaleString("fr-FR")}
                </p>
              </>
            )}
            renderDetails={(i) => (
                <>
                <p><strong>Signalé le :</strong> {new Date(i.createdAt).toLocaleString("fr-FR")}</p>
                <p><strong>Description :</strong> {i.description}</p>
              </>
            )}
          />
        </li>
      ))}
    </ul>
  );
}
