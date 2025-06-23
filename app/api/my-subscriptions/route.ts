// app/api/my-subscriptions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const subscriptions = await prisma.pushSubscription.findMany({
      select: {
        station: true,
        types: true,
      },
    });

    return NextResponse.json({ subscriptions });
  } catch (error) {
    console.error("❌ Erreur API /my-subscriptions :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
