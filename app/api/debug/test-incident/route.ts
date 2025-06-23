import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { EquipmentStatus, EquipmentType } from '@prisma/client';

export async function POST() {
  try {
    const TEST_STATION_SLUG = 'station-de-test-pour-les-ascenseurs'; // remplace par ton slug réel si besoin

    // 1. Récupération de la station
    const station = await prisma.station.findUnique({
      where: { slug: TEST_STATION_SLUG },
    });

    if (!station) {
      return NextResponse.json(
        { error: `Station '${TEST_STATION_SLUG}' introuvable` },
        { status: 404 }
      );
    }

    // 2. Création d’un équipement lié à cette station
    const equipment = await prisma.equipment.create({
      data: {
        name: `Équipement test ${Date.now()}`,
        type: EquipmentType.ESCALATOR,
        status: EquipmentStatus.DISPONIBLE,
        code: `TEST-${Date.now()}`,
        stationId: station.id,
        situation: 'Hall debug',
        direction: 'Nord',
        displayHistory: {},
      },
    });

    // 3. Création du signalement
    const report = await prisma.incidentReport.create({
      data: {
        description: 'Signalement via page debug',
        equipmentId: equipment.id,
        ip: '127.0.0.1',
        userAgent: 'debug-manual',
      },
    });

    // 4. Ajout à la file d’attente
    await prisma.notificationQueue.create({
      data: {
        equipmentId: equipment.id,
        excludedEndpoint: 'https://debug.endpoint.local/fake',
      },
    });

    return NextResponse.json({
      station: station.slug,
      equipmentId: equipment.id,
      reportId: report.id,
      message: '✅ Incident de test créé et ajouté à la queue',
    });
  } catch (err: any) {
    console.error('❌ Erreur test incident debug:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
