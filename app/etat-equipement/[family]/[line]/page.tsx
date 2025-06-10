import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StationStepper } from "@/components/ui/StationStepper";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { Station } from "@/types/station";

export default async function LineStatusPage({ params }: any) {
  const { family, line } = params;

  const dbStations = await prisma.station.findMany({
    where: {
      family: family.toLowerCase(),
      line,
    },
    include: {
      equipments: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  if (dbStations.length === 0) return notFound();

  const stations: Station[] = dbStations.map((s) => ({
    ...s,
    family: s.family as "metro" | "rer" | "tramway" | "bus",
    slug: s.name.toLowerCase().replace(/\s+/g, "-"),
    lineSymbol: "M",
    status: "ok",
  }));

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold">État des ascenseurs du Métro {line}</h1>

      <p className="text-muted-foreground text-sm">
        État des équipements le{" "}
        {new Date().toLocaleDateString("fr-FR")} à{" "}
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
