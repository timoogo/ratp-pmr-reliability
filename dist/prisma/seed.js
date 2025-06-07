"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const mockStations = [
    { name: "Mairie de Saint-Ouen", code: "ART_IDFM_43969", line: "14", family: "metro" },
    { name: "Saint-Ouen", code: "ART_IDFM_480289", line: "14", family: "metro" },
    { name: "Porte de Clichy", code: "ART_IDFM_473477", line: "14", family: "metro" },
    { name: "Pont Cardinet", code: "ART_IDFM_480287", line: "14", family: "metro" },
    { name: "Saint-Lazare", code: "ART_IDFM_462374", line: "14", family: "metro" },
    { name: "Madeleine", code: "ART_IDFM_43898", line: "14", family: "metro" },
    { name: "Pyramides", code: "ART_IDFM_44579", line: "14", family: "metro" },
    { name: "Châtelet", code: "ART_IDFM_42587", line: "14", family: "metro" },
    { name: "Bercy", code: "ART_IDFM_58728", line: "14", family: "metro" },
    { name: "Cour Saint-Emilion", code: "ART_IDFM_45234", line: "14", family: "metro" },
    { name: "Bibliothèque François Mitterrand", code: "ART_IDFM_473111", line: "14", family: "metro" },
    { name: "Olympiades", code: "ART_IDFM_479056", line: "14", family: "metro" },
];
const equipmentTypes = [
    "ASCENSEUR",
    "ESCALATOR",
    "PORTILLONS",
    "CABINE",
];
const equipmentStatuses = [
    "Disponible",
    "Indisponible",
    "En maintenance",
    "Hors service",
];
function random(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}
async function main() {
    await prisma.equipment.deleteMany();
    await prisma.station.deleteMany();
    for (const station of mockStations) {
        try {
            const createdStation = await prisma.station.create({
                data: {
                    name: station.name,
                    code: station.code,
                    line: station.line,
                    family: station.family,
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
        }
        catch (e) {
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
