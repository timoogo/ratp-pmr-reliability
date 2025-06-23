import { prisma } from "@/lib/prisma";
import webPush from "web-push";
import { QueueStatus } from "@prisma/client";

async function processQueue() {
  console.log("📬 Traitement de la file de notifications...");

  const pendingItems = await prisma.notificationQueue.findMany({
    where: { status: "PENDING" },
    include: {
      equipment: {
        include: {
          station: true,
        },
      },
    },
    take: 10,
  });

  if (pendingItems.length === 0) {
    console.log("✅ Aucune notification en attente.");
    return;
  }

  for (const item of pendingItems) {
    const { equipment, excludedEndpoint } = item;
    const station = equipment.station;
    const equipmentType = equipment.type;

    try {
      const subscriptions = await prisma.pushSubscription.findMany({
        where: {
          station: station.slug,
          frequency: "IMMEDIATE",
          types: { has: equipmentType },
          ...(excludedEndpoint ? { endpoint: { not: excludedEndpoint } } : {}),
        },
      });

      // 🧱 Construction du payload structuré
      const payload = JSON.stringify({
        station: {
          name: station.name,
          slug: station.slug,
          line: station.line,
          family: station.family,
        },
        equipment: {
          name: equipment.name,
          code: equipment.code,
          type: equipment.type,
          status: equipment.status,
        },
      });

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

      results.forEach((result, idx) => {
        if (result.status === "rejected") {
          console.error(`❌ Échec notification sub[${idx}] :`, result.reason);
        }
      });

      await prisma.notificationQueue.update({
        where: { id: item.id },
        data: {
          status: QueueStatus.SENT,
          sentAt: new Date(),
        },
      });

      console.log(`📤 Notification envoyée pour ${equipment.name} à ${station.name}`);
    } catch (error) {
      console.error(`❌ Échec envoi pour ${equipment.name}`, error);

      await prisma.notificationQueue.update({
        where: { id: item.id },
        data: {
          status: QueueStatus.FAILED,
          errorMessage: String(error).slice(0, 500),
        },
      });
    }
  }
}

// Exécution directe
if (require.main === module) {
  processQueue()
    .then(() => {
      console.log("🚀 Fin de traitement");
      process.exit(0);
    })
    .catch((err) => {
      console.error("❌ Erreur générale :", err);
      process.exit(1);
    });
}
