// /api/notify
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import webPush from "web-push";

export async function POST() {
  // Récupère tous les abonnements
  const subscriptions = await prisma.pushSubscription.findMany();

  // Message à envoyer
  const payload = JSON.stringify({
    title: "🛠️ Incident détecté",
    body: "Un équipement a changé de statut.",
    url: "http://localhost:3000/", // tu peux adapter
  });

  // Envoie les notifications
  const results = await Promise.allSettled(
    subscriptions.map((sub) =>
      webPush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: sub.keys as any,
        },
        payload
      )
    )
  );

  return NextResponse.json({ results });
}
