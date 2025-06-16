import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: "Missing equipment ID" }, { status: 400 });
  }

  const incidents = await prisma.incidentReport.findMany({
    where: { equipmentId: id },
    orderBy: { createdAt: "desc" },
    include: {
      equipment: {
        include: {
          histories: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
    take: 10,
  });

  return NextResponse.json(incidents);
}
