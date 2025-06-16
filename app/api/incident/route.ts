import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EquipmentStatus } from "@prisma/client";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    req.headers.get("x-real-ip") ??
    "inconnue";

  const userAgent = req.headers.get("user-agent") ?? "inconnu";

  if (!body.description || !body.equipmentId) {
    return NextResponse.json(
      { error: "Champs requis manquants" },
      { status: 400 }
    );
  }

  // 🔍 Récupère l'équipement concerné
  const equipment = await prisma.equipment.findUnique({
    where: { id: body.equipmentId },
  });

  if (!equipment) {
    return NextResponse.json(
      { error: "Équipement non trouvé" },
      { status: 404 }
    );
  }

  let createdHistory = null;

  // 🛠️ Si l'équipement est DISPONIBLE, on le passe en INDISPONIBLE + on crée un historique
  if (equipment.status === EquipmentStatus.DISPONIBLE) {
    await prisma.equipment.update({
      where: { id: equipment.id },
      data: {
        status: EquipmentStatus.INDISPONIBLE,
      },
    });

    createdHistory = await prisma.equipmentHistory.create({
      data: {
        equipmentId: equipment.id,
        status: EquipmentStatus.INDISPONIBLE,
        comment: "Statut mis à jour automatiquement suite à un signalement",
        date: new Date(),
      },
    });
  }

  // ✅ Enregistre le signalement
  const report = await prisma.incidentReport.create({
    data: {
      description: body.description,
      equipmentId: body.equipmentId,
      ip,
      userAgent,
    },
  });

  await fetch("http://ws:3001/notify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      station: equipment.stationId, // ou autre champ pertinent
      label: equipment.name,
      equipmentId: equipment.id,
      status: equipment.status,
    }),
  });
  

  return NextResponse.json(
    {
      incident: report,
      history: createdHistory, // peut être `null` si pas de mise à jour
    },
    { status: 201 }
  );
}
