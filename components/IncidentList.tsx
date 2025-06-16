import { GenericItemCard } from "./GenericItemCard";
import { IncidentWithEquipmentAndHistories } from "@/types/history";

export function IncidentList({
  incidents,
  renderDetails,
}: {
  incidents: IncidentWithEquipmentAndHistories[];
  renderDetails?: (incident: IncidentWithEquipmentAndHistories) => React.ReactNode;
}) {
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
            renderDetails={(i) =>
              renderDetails ? renderDetails(i) : (
                <>
                  <p><strong>Signalé le :</strong> {new Date(i.createdAt).toLocaleString("fr-FR")}</p>
                  <p><strong>Description :</strong> {i.description}</p>
                  <p><strong>Statut :</strong> {i.status}</p>
                  <p><strong>Équipement :</strong></p>
                  <p><strong>Pending in history :</strong> {i.equipment.histories.some(h => h.pending) ? "Oui" : "Non"}</p>
                  <p className="ml-4"><strong>Code :</strong> {i.equipment.code}</p>
                  <p className="ml-4"><strong>Nom :</strong> {i.equipment.name}</p>
                  <p className="ml-4"><strong>Statut :</strong> {i.equipment.status}</p>
                  <p className="ml-4"><strong>Créé le :</strong> {new Date(i.equipment.createdAt).toLocaleString("fr-FR")}</p>
                  <p className="ml-4"><strong>Mis à jour le :</strong> {new Date(i.equipment.updatedAt).toLocaleString("fr-FR")}</p>
                </>
              )
            }
          />
        </li>
      ))}
    </ul>
  );
}
