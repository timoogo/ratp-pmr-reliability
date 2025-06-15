// app/etat-equipement/[family]/[line]/[station]/page.tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { StationHeader } from "@/components/station/StationHeader";
import { StationInfoCard } from "@/components/station/StationInfoCard";

export default async function StationDetailPage({ params }: any) {
  const { family, line, station } = params;

  const stationData = await prisma.station.findUnique({
    where: { slug: station },
    include: { equipments: true },
  });

  if (!stationData) return notFound();

  return (
    <div className="p-6 flex flex-col gap-6 bg-gray-100 min-h-screen">
      <StationHeader line={stationData.line} name={stationData.name} />
      <StationInfoCard
        name={stationData.name}
        line={stationData.line}
        family={stationData.family}
        equipments={stationData.equipments}
      />
    </div>
  );
}
