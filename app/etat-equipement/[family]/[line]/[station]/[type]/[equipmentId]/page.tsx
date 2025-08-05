import EquipmentDetailClient from "@/components/EquipmentDetailClient";
import { prisma } from "@/lib/prisma";
import {
  EquipmentType as EquipmentTypeClient,
  EquipmentStatus as EquipmentStatusClient,
} from "@/types/equipement";
import { EquipmentStatus as EquipmentStatusPrisma, EquipmentType as EquipmentTypePrisma } from "@prisma/client";
import { notFound } from "next/navigation";

function getEquipmentTypeFromSlug(slug: string): EquipmentTypeClient | undefined {
  switch (slug) {
    case "ascenseurs":
      return EquipmentTypeClient.ASCENSEUR;
    case "escalators":
      return EquipmentTypeClient.ESCALATOR;
    case "portillons":
      return EquipmentTypeClient.PORTILLONS;
    case "cabinets":
      return EquipmentTypeClient.CABINES;
    default:
      return undefined;
  }
}

function mapStatus(status: EquipmentStatusPrisma): EquipmentStatusClient {
  switch (status) {
    case EquipmentStatusPrisma.DISPONIBLE:
      return EquipmentStatusClient.DISPONIBLE;
    case EquipmentStatusPrisma.INDISPONIBLE:
      return EquipmentStatusClient.INDISPONIBLE;
    case EquipmentStatusPrisma.EN_MAINTENANCE:
      return EquipmentStatusClient.EN_MAINTENANCE;
    default:
      return EquipmentStatusClient.INDISPONIBLE; // fallback
  }
}

function mapType(type: EquipmentTypePrisma): EquipmentTypeClient {
  switch (type) {
    case EquipmentTypePrisma.ASCENSEUR:
      return EquipmentTypeClient.ASCENSEUR;
    case EquipmentTypePrisma.ESCALATOR:
      return EquipmentTypeClient.ESCALATOR;
    case EquipmentTypePrisma.PORTILLONS:
      return EquipmentTypeClient.PORTILLONS;
    case EquipmentTypePrisma.CABINES:
      return EquipmentTypeClient.CABINES;
    default:
      return EquipmentTypeClient.ASCENSEUR; // fallback
  }
}

export default async function EquipmentDetailPage({ params }: any) {
  const type = getEquipmentTypeFromSlug(params.type);

  if (!type) return notFound();

  const equipmentData = await prisma.equipment.findFirst({
    where: {
      code: params.equipmentId,
      type: type as any, // Prisma enum type
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

  // Mapping des enums Prisma vers ceux du client
  const equipmentDataMapped = {
    ...equipmentData,
    status: mapStatus(equipmentData.status),
    type: mapType(equipmentData.type),
    histories: equipmentData.histories.map(h => ({
      ...h,
      date: h.date.toISOString(),
      createdAt: h.createdAt.toISOString(),
      status: mapStatus(h.status as EquipmentStatusPrisma),
    })),
    incidents: equipmentData.incidents.map((i: any) => ({
      ...i,
      createdAt: i.createdAt.toISOString(),
      updatedAt: i.updatedAt ? new Date(i.updatedAt).toISOString() : null,
    })),
    checks: equipmentData.checks.map((c: any) => ({
      ...c,
      createdAt: c.createdAt.toISOString(),
      updatedAt: c.updatedAt ? new Date(c.updatedAt).toISOString() : null,
    })),
    repairs: equipmentData.repairs.map((r: any)  => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt ? new Date(r.updatedAt).toISOString() : null,
    })),
  };
  
  

  return (
    <>
      <EquipmentDetailClient
        equipmentData={equipmentDataMapped}
        maintenanceDuration={1000 * 60 * 60 * 24 * 7}
      />
    </>
  );
}
