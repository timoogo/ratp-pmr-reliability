import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest  ,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  const histories = await prisma.equipmentHistory.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(histories);
}
