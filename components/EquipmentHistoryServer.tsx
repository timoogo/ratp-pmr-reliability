// components/equipment/EquipmentHistoryServer.tsx
import { prisma } from "@/lib/prisma";

type Props = {
  equipmentId: string;
};

export const EquipmentHistoryServer = async ({ equipmentId }: Props) => {
  const histories = await prisma.equipmentHistory.findMany({
    where: { equipmentId },
    orderBy: { createdAt: "desc" },
  });

  if (histories.length === 0) {
    return <p className="text-muted-foreground text-sm">Aucun historique disponible.</p>;
  }

  return (
    <ul className="space-y-2">
      {histories.map((history: any) => (
        <li key={history.id} className="text-sm">
          <p>
            <span className="font-semibold">{formatStatus(history.status)}</span>{" "}
            le {new Date(history.createdAt).toLocaleString("fr-FR")}
          </p>
          {history.comment && (
            <p className="text-muted-foreground text-xs">{history.comment}</p>
          )}
        </li>
      ))}
    </ul>
  );
};

function formatStatus(status: string) {
  switch (status.toUpperCase()) {
    case "DISPONIBLE":
      return "Disponible";
    case "INDISPONIBLE":
      return "Indisponible";
    case "EN_MAINTENANCE":
      return "En maintenance";
    default:
      return status;
  }
}
