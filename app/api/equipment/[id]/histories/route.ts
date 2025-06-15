// app/api/equipment/[id]/histories/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const histories = await prisma.equipmentHistory.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(histories);
}
