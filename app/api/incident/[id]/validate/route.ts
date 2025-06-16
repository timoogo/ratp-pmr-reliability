// app/api/incident/[id]/validate/route.ts
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "ID manquant dans l'URL" }, { status: 400 });
  }

  try {
    const result = await prisma.equipmentHistory.update({
      where: { id },
      data: { pending: false },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      // Aucun enregistrement correspondant trouvé
      return NextResponse.json(
        { error: "Historique introuvable" },
        { status: 404 }
      );
    }

    console.error("Erreur lors de la validation :", error);
    return NextResponse.json(
      { error: "Erreur serveur inconnue" },
      { status: 500 }
    );
  }
}
