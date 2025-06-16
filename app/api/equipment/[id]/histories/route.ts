import { prisma } from "@/lib/prisma";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: any
) {
  const { id } = context.params;

  const histories = await prisma.equipmentHistory.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(histories);
}
