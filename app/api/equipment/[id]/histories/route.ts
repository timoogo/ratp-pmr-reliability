import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const parts = url.pathname.split("/");
  const id = parts[parts.length - 2]; // <- car route = /api/equipment/[id]/histories

  const histories = await prisma.equipmentHistory.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(histories);
}
