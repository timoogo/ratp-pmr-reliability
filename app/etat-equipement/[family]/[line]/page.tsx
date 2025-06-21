import { LineStatusClient } from "@/components/LineStatusClient";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

type Props = {
  params: {
    family: string;
    line: string;
  };
};

export default async function LineStatusPage({ params }: Props) {
  const { family, line } = params;

  const dbStations = await prisma.station.findMany({
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

  if (dbStations.length === 0) return notFound();

  const stations = dbStations.map((s) => ({
    name: s.name,
    slug: s.slug,
    equipments: s.equipments.map((e) => ({
      id: e.id,
      type: e.type,
      status: e.status,
      updatedAt: e.updatedAt.toISOString(),
    })),
    family,
    line,
  }));

  return <LineStatusClient line={line} stations={stations} />;
}
