import { StationHeader } from "@/components/station/StationHeader";
import { StationInfoCard } from "@/components/station/StationInfoCard";
import { prisma } from "@/lib/prisma";
import { formatFromOptions } from "@/lib/utils";
import { notFound } from "next/navigation";

export default async function StationDetailPage({ params }: any) {
  const { station, type } = params;

  const stationData = await prisma.station.findUnique({
    where: { slug: station },
    include: { equipments: true },
  });

  if (!stationData) return notFound();

  const filteredEquipments = stationData.equipments
  .filter((e: any) => {
    const { label } = formatFromOptions(e.type, {
      plural: true,
      lowercase: true,
    });
    return label === type;
  })
  .map((e: any) => ({
    ...e,
    station: {
      id: stationData.id,
      name: stationData.name,
      slug: stationData.slug,
      line: stationData.line,
      family: stationData.family,
    },
  }));


  return (
    <div className="p-6 flex flex-col gap-6 bg-gray-100 min-h-screen">
      <StationHeader
        line={stationData.line}
        name={stationData.name}
        type={type}
      />
      <StationInfoCard
        name={stationData.name}
        line={stationData.line}
        family={stationData.family}
        equipments={filteredEquipments}
        type={type}
      />
    </div>
  );
}
