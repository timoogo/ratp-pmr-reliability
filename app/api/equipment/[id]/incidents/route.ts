import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { id } = context.params;

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
