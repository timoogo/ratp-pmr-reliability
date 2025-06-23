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

  const equipment = await prisma.equipment.findUnique({
    where: { id: equipmentId },
    include: { station: true },
  });

  if (!equipment) {
    return NextResponse.json(
      { error: "Équipement non trouvé" },
      { status: 404 }
    );
  }

  // ✅ Logique de confirmation automatique (seuil ici : 3 incidents en 2h)
  const INCIDENT_THRESHOLD = 3;
  const TIME_WINDOW_HOURS = 2;

  const recentReports = await prisma.incidentReport.findMany({
    where: {
      equipmentId,
      createdAt: {
        gte: new Date(Date.now() - TIME_WINDOW_HOURS * 60 * 60 * 1000),
      },
    },
  });

  const autoConfirm = recentReports.length >= INCIDENT_THRESHOLD;

  let createdHistory = null;

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
        pending: !autoConfirm, // ✅ confirmé si seuil atteint
      },
    });
  }

  const report = await prisma.incidentReport.create({
    data: {
      description,
      equipmentId,
      ip,
      userAgent,
    },
  });

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


  // Ajout en file d'attente pour traitement différé (notifications push)
try {
  await prisma.notificationQueue.create({
    data: {
      equipmentId: equipment.id,
      excludedEndpoint: body.subscriptionEndpoint ?? null,
    },
  });
} catch (queueError) {
  console.warn("⚠️ Erreur lors de la mise en queue pour notification :", queueError);
  // On n’interrompt pas l’API pour ça
}


  return NextResponse.json(
    {
      incident: report,
      history: createdHistory,
    },
    { status: 201 }
  );
}
