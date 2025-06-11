import EquipmentDetailClient from "@/components/EquipmentDetailClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export default async function EquipmentDetailPage({ params }: any) {
  const equipmentData = await prisma.equipment.findUnique({
    where: { code: params.equipment },
    include: {
      station: true,
      histories: { orderBy: { date: "desc" } },
      checks: true,
      repairs: true,
    },
  });

  if (!equipmentData) return notFound();

  return (
    <EquipmentDetailClient
      equipmentData={equipmentData}
      maintenanceDuration={1000 * 60 * 60 * 24 * 7}
    />
  );
}
