import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/");

  const family = segments.at(-2);
  const line = segments.at(-1);

  if (!family || !line) {
    return NextResponse.json({ error: "Paramètres manquants" }, { status: 400 });
  }

  const stations = await prisma.station.findMany({
    where: {
      family: family.toLowerCase(),
      line,
    },
    include: {
      equipments: {
        select: {
          id: true,
          status: true,
          type: true,
          updatedAt: true,
        },
      },
    },
    orderBy: {
      stationOrder: "asc",
    },
  });

  return NextResponse.json(
    stations.map((s) => ({
      name: s.name,
      slug: s.slug,
      family,
      line,
      equipments: s.equipments.map((e) => ({
        id: e.id,
        type: e.type,
        status: e.status,
        updatedAt: e.updatedAt.toISOString(),
      })),
    }))
  );
}
