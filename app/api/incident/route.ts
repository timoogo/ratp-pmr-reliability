import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { description, equipmentId, status } = body;

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "inconnue";

  const userAgent = req.headers.get("user-agent") ?? "inconnu";

  if (!description || !equipmentId || !status) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  // 🔍 Récupère l'équipement concerné
  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: {
      station: true,
    },
  });
  console.log("📦 Equipment:", equipment);

  if (!equipment) {
    return NextResponse.json(
      { error: "Équipement non trouvé" },
      { status: 404 }
    );
  }

  let createdHistory = null;

  // Met à jour le statut uniquement s'il est différent
  if (status !== equipment.status) {
    await prisma.equipment.update({
      where: { id: equipment.id },
      data: {
        status: status as EquipmentStatus,
      },
    });

    createdHistory = await prisma.equipmentHistory.create({
      data: {
        equipmentId: equipment.id,
        status: status as EquipmentStatus,
        comment: "Statut mis à jour suite à un signalement",
        date: new Date(),
      },
    });
  }

  // ✅ Enregistre le signalement
  const report = await prisma.incidentReport.create({
    data: {
      description,
      equipmentId,
      ip,
      userAgent,
    },
  });

  // Envoie la notification via WebSocket
  await fetch("http://ws:3001/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      station: {
        name: equipment.station.name,
        code: equipment.station.code,
        line: equipment.station.line,
        family: equipment.station.family,
        slug: equipment.station.slug,
        type: equipment.type,
      },
      label: equipment.name,
      equipmentId: equipment.id,
      equipmentCode: equipment.code,
      status: status,
    }),
  });

  return NextResponse.json(
    {
      incident: report,
      history: createdHistory,
    },
    { status: 201 }
  );
}
