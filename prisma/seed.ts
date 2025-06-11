 import { EquipmentType, PrismaClient } from '@prisma/client';
 import { mockStations } from '../mock/stations';
 const prisma = new PrismaClient();


 const equipmentTypes: EquipmentType[] = [
   "ASCENSEUR",
   "ESCALATOR",
   "PORTILLONS",
   "CABINES",
 ];

 const equipmentStatuses = [
   "Disponible",
   "Indisponible",
   "En maintenance",
   "Hors service",
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
   await prisma.equipment.deleteMany();
   await prisma.station.deleteMany();

   for (const station of mockStations) {
    try {
      const createdStation = await prisma.station.create({
        data: {
          name: station.name,
          code: station.code,
          slug: toSlug(station.name), // 🔥 FORCÉ à chaque fois
          line: station.line,
          family: station.family,
          stationOrder: station.stationOrder,
          equipments: {
            create: Array.from({ length: Math.floor(Math.random() * 3) + 1 }).map((_, i) => ({
              type: "ASCENSEUR",
              status: random(equipmentStatuses),
              name: `Ascenseur ${i + 1}`,
              code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
            })),
          },
        },
      });
      
      
  
      console.log(`✅ Station créée : ${createdStation.name}`);
    } catch (e) {
      console.error(`❌ Erreur sur la station ${station.name} (${station.code}):`, e);
    }
  }
  
   console.log(`✅ Stations créées : ${mockStations.length}`);
   console.log(`✅ Équipements créés : ${mockStations.length * 3}`);
 }

 main()
   .catch((e) => {
     console.error("❌ Erreur lors du seed :", e);
     process.exit(1);
   })
   .finally(async () => {
     await prisma.$disconnect();
   });
