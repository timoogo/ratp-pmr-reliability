// File: /app/etat-equipement/[family]/[line]/[station]/[type]/[equipmentId]/page.tsx
import EquipmentDetailClient from "@/components/EquipmentDetailClient";
import { prisma } from "@/lib/prisma";
import { EquipmentType } from "@prisma/client";
import { notFound } from "next/navigation";

function getEquipmentTypeFromSlug(slug: string): EquipmentType | undefined {
  switch (slug) {
    case "ascenseurs":
      return EquipmentType.ASCENSEUR;
    case "escalators":
      return EquipmentType.ESCALATOR;
    case "portillons":
      return EquipmentType.PORTILLONS;
    case "cabinets":
      return EquipmentType.CABINES;
    default:
      return undefined;
  }
}

export default async function EquipmentDetailPage({ params }: any) {
  const type = getEquipmentTypeFromSlug(params.type);

  const equipmentData = await prisma.equipment.findUnique({
    where: {
      code: params.equipmentId,
      type,
    },
    include: {
      station: true,
      histories: { orderBy: { date: "desc" } },
      checks: true,
      repairs: true,
      incidents: { orderBy: { createdAt: "desc" } },
      
    },
  });

  if (!equipmentData) return notFound();

  return (
    <>
      <EquipmentDetailClient
        equipmentData={equipmentData}
        maintenanceDuration={1000 * 60 * 60 * 24 * 7}
      />
    </>
  );
}
