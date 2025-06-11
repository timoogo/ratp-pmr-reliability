"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const stations_1 = require("../mock/stations");
const prisma = new client_1.PrismaClient();
const equipmentTypes = [
    "ASCENSEUR",
    "ESCALATOR",
    "PORTILLONS",
    "CABINES",
];
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
function toSlug(str) {
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
    for (const station of stations_1.mockStations) {
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
                        create: Array.from({
                            length: Math.floor(Math.random() * 3) + 1,
                        }).map((_, i) => ({
                            type: "ASCENSEUR",
                            status: random(Object.values(client_1.EquipmentStatus)), name: `Ascenseur ${i + 1}`,
                            code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
                        })),
                    },
                },
            });
            const equipments = await prisma.equipment.findMany({
                where: { stationId: createdStation.id },
            });
            for (const equipment of equipments) {
                // Historique d'état - 10 entrées
                for (let i = 0; i < 10; i++) {
                    await prisma.equipmentHistory.create({
                        data: {
                            equipmentId: equipment.id,
                            date: new Date(Date.now() - 1000 * 60 * 60 * 24 * i), // i jours avant
                            status: random(Object.values(client_1.EquipmentStatus)),
                            comment: `État #${i + 1} généré automatiquement.`,
                        },
                    });
                }
                // Vérification - 10 entrées
                for (let i = 0; i < 10; i++) {
                    await prisma.equipmentCheck.create({
                        data: {
                            equipmentId: equipment.id,
                            checkedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * i),
                            agent: "AgentSeedBot",
                            comment: `Vérification #${i + 1} lors du seed.`,
                        },
                    });
                }
                // Réparation fictive si KO - 10 entrées si applicable
                if (equipment.status !== "DISPONIBLE") {
                    for (let i = 0; i < 10; i++) {
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
        }
        catch (e) {
            console.error(`❌ Erreur sur la station ${station.name} (${station.code}):`, e);
        }
    }
    console.log(`✅ Stations créées : ${stations_1.mockStations.length}`);
    console.log(`✅ Équipements créés : ${stations_1.mockStations.length * 3}`);
}
main()
    .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
