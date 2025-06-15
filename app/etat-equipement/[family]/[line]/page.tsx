import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { StationStepper } from "@/components/ui/StationStepper";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { EquipmentType, EquipmentStatus } from "@prisma/client"

// Déduction du statut d’une station à partir de ses équipements
  function getStationStatus(equipments: { status: EquipmentStatus; type: EquipmentType }[]): "ok" | "warning" | "current" {
  const elevators = equipments.filter((e) => e.type === EquipmentType.ASCENSEUR);

  if (elevators.length === 0) return "current";

  const hasProblem = elevators.some((e) =>
    ([EquipmentStatus.INDISPONIBLE, EquipmentStatus.EN_MAINTENANCE] as EquipmentStatus[]).includes(e.status)
  );
  

  return hasProblem ? "warning" : "ok";
}

// Type local utilisé uniquement dans cette page
type StationWithMinimalData = {
  name: string;
  slug: string;
  line: string;
  family: "metro" | "rer" | "tramway" | "bus";
  stationOrder: number;
  lineSymbol: "M" | "RER" | "T" | "B";
  status: "ok" | "warning" | "current";
};

export default async function LineStatusPage({
  params,
}: {
  params: { family: string; line: string };
}) {
  const { family, line } = params;

  const dbStations = await prisma.station.findMany({
    where: {
      family: family.toLowerCase(),
      line,
    },
    include: {
      equipments: {
        select: {
          status: true,
          type: true,
        },
      },
    },
    orderBy: {
      stationOrder: "asc",
    },
  });

  if (dbStations.length === 0) return notFound();

  const stations: StationWithMinimalData[] = dbStations.map((s) => ({
    name: s.name,
    slug: s.slug,
    line: s.line,
    family: s.family as "metro" | "rer" | "tramway" | "bus",
    stationOrder: s.stationOrder,
    lineSymbol: "M",
    status: getStationStatus(s.equipments),
  }));

  stations.forEach((s) => {
    console.log(`${s.name} → ${s.status}`);
  });
  

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold">État des ascenseurs du Métro {line}</h1>

      <p className="text-muted-foreground text-sm">
        État des équipements le {new Date().toLocaleDateString("fr-FR")} à{" "}
        {new Date().toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
        })}
      </p>

      <ContentCardWrapper>
        <StationStepper stations={stations} />
      </ContentCardWrapper>
    </div>
  );
}
