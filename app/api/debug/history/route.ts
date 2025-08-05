// app/api/debug/history/route.ts
/*
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const { equipmentId, status, comment } = await req.json();

  if (!equipmentId || !status) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }

  const incident = await prisma.incidentReport.create({
    data: {
      equipmentId,
      description: comment ?? "Incident debug",
      ip: "127.0.0.1",
      userAgent: "debug",
    },
  });

  const history = await prisma.equipmentHistory.create({
    data: {
      equipmentId,
      status,
      comment,
      date: new Date(),
      pending: true,
    },
  });

  return NextResponse.json(history);
}


*/
import { NextResponse } from "next/server";

 

export async function POST(req: Request) {
  return NextResponse.json({ message: "Hello, world!" });
} 