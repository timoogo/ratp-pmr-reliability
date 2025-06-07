import { notFound } from "next/navigation";
import { mockStations } from "@/mock/stations";
import { StationStepper } from "@/components/ui/StationStepper";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";



export default function LineStatusPage({ params }: { params: any }) {
    const { family, line } = params;

  const stations = mockStations.filter(
    (station) =>
      station.family.toLowerCase() === family.toLowerCase() &&
      station.line === line
  );

  if (stations.length === 0) return notFound();

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
