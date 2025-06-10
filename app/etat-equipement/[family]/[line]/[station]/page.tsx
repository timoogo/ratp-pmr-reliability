import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";

export default async function StationDetailPage({ params }: any) {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const { family, line, station } = params;

  const stationData = await prisma.station.findUnique({
    where: {
      slug: station,
    },
  });
  console.log("params.station =", station);
  if (!stationData) return notFound();

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold">{stationData.name}</h1>

      <p className="text-muted-foreground text-sm">
        Détails pour la station {stationData.name} de la ligne {stationData.line}.
      </p>

      <ContentCardWrapper>
        <p className="text-muted-foreground">
          Code : {stationData.code}
          <br />
          Famille : {stationData.family}
          <br />
          Ligne : {stationData.line}
        </p>
      </ContentCardWrapper>
    </div>
  );
}
