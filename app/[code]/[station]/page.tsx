import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { mockStations } from "@/mock/stations";
import { notFound } from "next/navigation";

export default function StationPage({ params }: { params:any }) {
  const { family, line, station } = params;

  const stationData = mockStations.find(
    (s) =>
      s.family.toLowerCase() === family.toLowerCase() &&
      s.line === line &&
      s.slug === station
  );

  if (!stationData) return notFound();

  return (
    <div className="p-4 flex flex-col gap-4 bg-gray-200 min-h-screen">
      <h1 className="text-2xl font-bold">Équipements à {stationData.name}</h1>

      <ContentCardWrapper>
        {!stationData.equipments || stationData.equipments.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun équipement.</p>
        ) : (
          stationData.equipments.map((eq, index) => (
            <div key={index} className="border-b py-4">
              <div className="flex items-start gap-4">
                <div className="w-6 h-6 shrink-0">
                  <span className="w-full h-full bg-blue-600 text-white flex items-center justify-center rounded">
                    {eq.type === "ASCENSEUR" ? "↑" : "?"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    <span className="font-semibold">Situation :</span>{" "}
                    {eq.situation?.raw ||
                      `${eq.situation?.levels?.from ?? ""} vers ${
                        eq.situation?.levels?.to ?? ""
                      } — ${eq.situation?.description ?? ""}`}
                  </p>
                  {eq.direction && (
                    <p className="text-sm mt-1 text-gray-700">
                      <span className="font-semibold">Direction :</span>{" "}
                      {eq.direction}
                    </p>
                  )}
                </div>
                <div className="shrink-0 text-green-600 font-semibold">
                  {eq.status === "Disponible" ? (
                    <span className="text-green-600">✔ Disponible</span>
                  ) : (
                    <span className="text-red-600">✘ {eq.status}</span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </ContentCardWrapper>
    </div>
  );
}
