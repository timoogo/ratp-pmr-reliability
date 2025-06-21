import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const station = await prisma.station.findUnique({
    where: { slug: params.slug },
    select: { name: true },
  });

  if (!station) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json(station);
}
