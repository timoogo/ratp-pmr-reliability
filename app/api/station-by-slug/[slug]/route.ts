import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const slug = url.pathname.split("/").at(-1); // récupère le [slug]

  if (!slug) {
    return NextResponse.json({ error: "Slug manquant" }, { status: 400 });
  }

  const station = await prisma.station.findUnique({
    where: { slug },
    select: { name: true },
  });

  if (!station) {
    return NextResponse.json({ error: "Station not found" }, { status: 404 });
  }

  return NextResponse.json(station);
}
