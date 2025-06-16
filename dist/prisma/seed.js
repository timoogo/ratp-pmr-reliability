"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const stations_1 = require("../mock/stations");
const equipments_1 = require("../mock/equipments");
const prisma = new client_1.PrismaClient();
const equipmentTypes = [
    "ASCENSEUR",
    "ESCALATOR",
    "PORTILLONS",
    "CABINES",
];
function generateStatusHistory(current, length = 10) {
    const history = [current];
    while (history.length < length) {
        const prev = history[0];
        switch (prev) {
            case "DISPONIBLE":
                history.unshift("EN_MAINTENANCE");
                break;
            case "EN_MAINTENANCE":
                history.unshift("INDISPONIBLE");
                break;
            case "INDISPONIBLE":
                history.unshift(Math.random() > 0.5 ? "INDISPONIBLE" : "EN_MAINTENANCE");
                break;
        }
    }
    return history;
}
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
            const equipmentData = equipments_1.stationEquipmentsMap[station.name] ?? [];
            const createdStation = await prisma.station.create({
                data: {
                    name: station.name,
                    code: station.code,
                    slug: toSlug(station.name),
                    line: station.line,
                    family: station.family,
                    stationOrder: station.stationOrder,
                    equipments: {
                        create: [
                            ...equipmentData.map((data, i) => ({
                                name: `Ascenseur ${i + 1}`,
                                code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
                                type: client_1.EquipmentType.ASCENSEUR,
                                status: random(Object.values(client_1.EquipmentStatus)),
                                ...data,
                            })),
                            {
                                name: "Escalator",
                                code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
                                type: client_1.EquipmentType.ESCALATOR,
                                status: random(Object.values(client_1.EquipmentStatus)),
                                situation: "Hall principal",
                                direction: "Vers sortie",
                            },
                            ...Array.from({ length: 4 }, (_, j) => ({
                                name: `Portillon ${j + 1}`,
                                code: `ART_IDFM_${Math.floor(100000 + Math.random() * 900000)}`,
                                type: client_1.EquipmentType.PORTILLONS,
                                status: random(Object.values(client_1.EquipmentStatus)),
                                situation: "Zone d'accès",
                                direction: "Entrée",
                            })),
                        ],
                    },
                },
            });
            const equipments = await prisma.equipment.findMany({
                where: { stationId: createdStation.id },
            });
            for (const equipment of equipments) {
                const history = generateStatusHistory(equipment.status, 10); // le dernier = statut actuel
                for (let i = 0; i < history.length; i++) {
                    const date = new Date(Date.now() - 1000 * 60 * 60 * 24 * (history.length - 1 - i));
                    await prisma.equipmentHistory.create({
                        data: {
                            equipmentId: equipment.id,
                            date,
                            status: history[i],
                            comment: `État #${i + 1} généré automatiquement.`,
                        },
                    });
                    await prisma.equipmentCheck.create({
                        data: {
                            equipmentId: equipment.id,
                            checkedAt: date,
                            agent: "AgentSeedBot",
                            comment: `Vérification #${i + 1} lors du seed.`,
                        },
                    });
                    if (history[i] !== "DISPONIBLE") {
                        await prisma.equipmentRepair.create({
                            data: {
                                equipmentId: equipment.id,
                                repairedAt: date,
                                comment: `Réparation #${i + 1} simulée après panne.`,
                            },
                        });
                    }
                }
                const historiesCount = await prisma.equipmentHistory.count({
                    where: { equipmentId: equipment.id },
                });
                const repairsCount = await prisma.equipmentRepair.count({
                    where: { equipmentId: equipment.id },
                });
                console.log(`🔧 Historique généré pour ${equipment.name}: ${historiesCount} entrées`);
                console.log(`🛠️ Réparations simulées pour ${equipment.name}: ${repairsCount} entrées`);
            }
        }
        catch (e) {
            console.error(`❌ Erreur sur la station ${station.name} (${station.code}):`, e);
        }
    }
    console.log(`✅ Stations créées : ${stations_1.mockStations.length}`);
}
main()
    .catch((e) => {
    console.error("❌ Erreur lors du seed :", e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
