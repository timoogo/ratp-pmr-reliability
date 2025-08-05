import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function StationEquipmentsPage({ params }: any) {
  const { station, type } = params;

  const stationData = await prisma.station.findUnique({
    where: { slug: station },
    include: {
      equipments: {
        include: { station: true }, // ✅ correction ici
      },
    },
  });

  if (!stationData) return notFound();

  const filteredEquipments = stationData.equipments.filter(
    (e) => e.type === type
  );

  return (
    <div>
      {filteredEquipments.map((eq) => (
        <div key={eq.id}>
          {eq.name} – {eq.status} – {eq.station.name}
        </div>
      ))}
    </div>
  );
}
