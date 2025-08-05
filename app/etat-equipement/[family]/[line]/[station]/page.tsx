import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { prisma } from "@/lib/prisma";
import { formatFromOptions } from "@/lib/utils";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function StationDetailPage({ params }: any) {
  const { station } = params;

  const stationData = await prisma.station.findUnique({
    where: { slug: station },
    include: { equipments: true },
  });

  if (!stationData) return notFound();

  const types = [...new Set(stationData.equipments.map((e: any) => e.type))];

  return (
    <>
      {types.map((type: any) => {
        const { label } = formatFromOptions(type, {
          plural: true,
          lowercase: true,
        });

        return (
          <ContentCardWrapper
            key={type}
            className="h-12 flex bg-white mt-16 mx-4 items-center justify-between px-6 py-4 border-b"
          >
            
            <Link
              href={`/etat-equipement/${stationData.family}/${stationData.line}/${stationData.slug}/${label}`}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Voir l'état des {label}
            </Link>
          </ContentCardWrapper>
        );
      })}
    </>
  );
}
