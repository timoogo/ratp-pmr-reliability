// components/IncidentList.tsx
import { IncidentReport } from "@prisma/client";

type Props = {
  incidents: IncidentReport[];
};

export function IncidentList({ incidents }: Props) {
  if (!incidents.length) {
    return <p className="text-muted-foreground text-sm">Aucun signalement récent</p>;
  }

  return (
    <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
      {incidents.map((incident) => (
        <li key={incident.id} className="border p-2 rounded bg-white">
          <p className="font-medium">{incident.description}</p>
          <p className="text-xs">
            {new Date(incident.createdAt).toLocaleString("fr-FR")}
          </p>
        </li>
      ))}
    </ul>
  );
}
