  import { EquipmentStatus,  EquipmentType, PrismaClient } from "@prisma/client";
  import { mockStations } from "../mock/stations";
  import { stationEquipmentsMap } from "../mock/equipments";
  const prisma = new PrismaClient();

  const equipmentTypes: EquipmentType[] = [
    "ASCENSEUR",
    "ESCALATOR",
    "PORTILLONS",
    "CABINES",
  ];







  function random<T>(arr: readonly T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function toSlug(str: string): string {
    return str
      .toLowerCase()
      .normalize("NFD") // retire les accents
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "")
      .replace(/\-+/g, "-");
  }

  async function main() {
    console.log("🚀 seed.ts recompilé", new Date());
  
    await prisma.equipmentHistory.deleteMany();
    await prisma.equipmentCheck.deleteMany();
    await prisma.equipmentRepair.deleteMany();
    await prisma.equipment.deleteMany();
    await prisma.station.deleteMany();
  
    for (const station of mockStations) {
      try {
        const equipmentData =
          stationEquipmentsMap[station.name] ??
          []; // ou fallback: Array.from({ length: 2 }, () => ({
             //   situation: "Inconnue",
             //   direction: "Inconnue",
             // }));
  
        const createdStation = await prisma.station.create({
          data: {
            name: station.name,
            code: station.code,
            slug: toSlug(station.name),
            line: station.line,
            family: station.family,
            stationOrder: station.stationOrder,
            equipments: {
              create: equipmentData.map((data, i) => ({
                name: `Ascenseur ${i + 1}`,
                code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
                type: "ASCENSEUR",
                status: random(Object.values(EquipmentStatus)),
                ...data,
              })),
            },
          },
        });
  
        const equipments = await prisma.equipment.findMany({
          where: { stationId: createdStation.id },
        });
  
        for (const equipment of equipments) {
          for (let i = 0; i < 10; i++) {
            await prisma.equipmentHistory.create({
              data: {
                equipmentId: equipment.id,
                date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
                status: random(Object.values(EquipmentStatus)),
                comment: `État #${i + 1} généré automatiquement.`,
              },
            });
  
            await prisma.equipmentCheck.create({
              data: {
                equipmentId: equipment.id,
                checkedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
                agent: "AgentSeedBot",
                comment: `Vérification #${i + 1} lors du seed.`,
              },
            });
  
            if (equipment.status !== "DISPONIBLE") {
              await prisma.equipmentRepair.create({
                data: {
                  equipmentId: equipment.id,
                  repairedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
                  comment: `Réparation #${i + 1} simulée après panne.`,
                },
              });
            }
          }
        }
  
        console.log(`✅ Station créée : ${createdStation.name}`);
        console.log(`✅ Équipements créés : ${equipments.length}`);
      } catch (e) {
        console.error(
          `❌ Erreur sur la station ${station.name} (${station.code}):`,
          e
        );
      }
    }
  
    console.log(`✅ Stations créées : ${mockStations.length}`);
  }
  
  main()
    .catch((e) => {
      console.error("❌ Erreur lors du seed :", e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });