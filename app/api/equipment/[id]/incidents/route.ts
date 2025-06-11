import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const segments = url.pathname.split("/");

  // On récupère l'avant-dernier segment s’il suit le schéma /equipment/[id]/incidents
  const id = segments[segments.length - 2];

  if (!id) {
    return NextResponse.json({ error: "Missing equipment ID" }, { status: 400 });
  }

  const incidents = await prisma.incidentReport.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return NextResponse.json(incidents);
}
