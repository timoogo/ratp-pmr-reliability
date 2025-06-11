import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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
