// api/push-subscriptions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { EquipmentType, SubscriptionFrequency } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      subscription,
      stationSlug,
      frequency,
      types,
    }: {
      subscription: {
        endpoint: string;
        keys: {
          p256dh: string;
          auth: string;
        };
      };
      stationSlug: string;
      frequency: SubscriptionFrequency;
      types: string[];
    } = body;

    if (
      !subscription?.endpoint ||
      !subscription?.keys?.p256dh ||
      !subscription?.keys?.auth ||
      !stationSlug ||
      !frequency ||
      !Array.isArray(types)
    ) {
      return NextResponse.json(
        { error: "Corps de requête invalide" },
        { status: 400 }
      );
    }

    const validTypes = Object.values(EquipmentType);
    const sanitizedTypes = types.filter((t): t is EquipmentType =>
      validTypes.includes(t as EquipmentType)
    );

    if (sanitizedTypes.length === 0) {
      console.warn("⚠️ Aucun type valide détecté :", types);
      return NextResponse.json(
        { error: "Aucun type d’équipement valide fourni" },
        { status: 400 }
      );
    }

    // Supprime l'abonnement s'il existe déjà
    await prisma.pushSubscription.deleteMany({ where: { 
      endpoint: subscription.endpoint,
      station: stationSlug,
    } });

    console.log("📥 Nouvelle subscription reçue :", {
      endpoint: subscription.endpoint,
      stationSlug,
      frequency,
      types: sanitizedTypes,
    });

    // Crée le nouvel abonnement
    await prisma.pushSubscription.create({
      data: {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
        station: stationSlug,
        frequency,
        types: sanitizedTypes,
      },
    });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement de l'abonnement :", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  try {
    const subscriptions = await prisma.pushSubscription.findMany();
    // Tu peux filtrer ou transformer les données ici si besoin
    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error("Erreur lors de la récupération des abonnements :", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des abonnements" },
      { status: 500 }
    );
  }
}