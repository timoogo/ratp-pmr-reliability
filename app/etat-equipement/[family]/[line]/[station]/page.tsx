import { notFound } from "next/navigation";
import { mockStations } from "@/mock/stations";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";

export default function StationDetailPage({ params }: any) {
  const { family, line, station } = params;

  const stationData = mockStations.find(
    (s) =>
      s.family.toLowerCase() === family.toLowerCase() &&
      s.line === line &&
      s.slug === station.toLowerCase()
  );

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
