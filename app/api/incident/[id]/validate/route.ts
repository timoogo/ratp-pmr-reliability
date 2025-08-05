import { prisma } from "@/lib/prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.pathname.split("/").at(-2); // car /[id]/validate

  if (!id) {
    return NextResponse.json({ error: "ID manquant" }, { status: 400 });
  }

  try {
    await prisma.equipmentHistory.update({
      where: { id },
      data: { pending: false },
    });

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
      error instanceof PrismaClientKnownRequestError &&
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
