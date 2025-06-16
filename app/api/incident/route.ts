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

  // 🛠️ Met à jour le statut si l'équipement est actuellement marqué comme disponible
  if (equipment.status === EquipmentStatus.DISPONIBLE) {
    await prisma.equipment.update({
      where: { id: equipment.id },
      data: {
        status: EquipmentStatus.INDISPONIBLE,
      },
    });

    // 🧾 Ajoute une ligne dans l'historique
    await prisma.equipmentHistory.create({
      data: {
        equipmentId: equipment.id,
        status: EquipmentStatus.INDISPONIBLE,
        comment: "Statut mis à jour automatiquement suite à un signalement",
        date: new Date(),
      },
    });
    await prisma.equipmentHistory.create({
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



  return NextResponse.json(report, { status: 201 });
}
