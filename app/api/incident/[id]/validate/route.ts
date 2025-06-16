import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await prisma.equipmentHistory.update({
      where: { id },
      data: { pending: false },
    });

    // 🔥 Envoie l'événement au serveur WebSocket
    await fetch("http://ws:3001/broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "history-validated",
        id,
        message: "Un historique a été validé",
      }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { error: "Historique introuvable" },
        { status: 404 }
      );
    }

    console.error("Erreur lors de la validation :", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
