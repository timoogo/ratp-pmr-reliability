import { LineFamilyCard } from "@/components/LineFamilyCard";

export default async function FamilyLinesPage() {
  const metro_lines = [
    { code: "1", imageSrc: "/picto/metros/metro_1.png" },
    { code: "2", imageSrc: "/picto/metros/metro_2.png" },
    { code: "3", imageSrc: "/picto/metros/metro_3.png" },
    { code: "3bis", imageSrc: "/picto/metros/metro_3_bis.png" },
    { code: "4", imageSrc: "/picto/metros/metro_4.png" },
    { code: "5", imageSrc: "/picto/metros/metro_5.png" },
    { code: "6", imageSrc: "/picto/metros/metro_6.png" },
    { code: "7", imageSrc: "/picto/metros/metro_7.png" },
    { code: "7bis", imageSrc: "/picto/metros/metro_7_bis.png" },
    { code: "8", imageSrc: "/picto/metros/metro_8.png" },
    { code: "9", imageSrc: "/picto/metros/metro_9.png" },
    { code: "10", imageSrc: "/picto/metros/metro_10.png" },
    { code: "11", imageSrc: "/picto/metros/metro_11.png" },
    { code: "12", imageSrc: "/picto/metros/metro_12.png" },
    { code: "13", imageSrc: "/picto/metros/metro_13.png" },
    {
      code: "14",
      imageSrc: "/picto/metros/metro_14.png",
      hasEquipementsForAccessibility: true,
    },
  ];

  return (
    <div className="bg-gray-300 h-screen p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">
        État des ascenseurs sur les lignes RATP
      </h1>
      <p>
        Retrouvez en direct l’état des ascenseurs par ligne. Sélectionnez
        préalablement une ligne afin d’accéder au détail par station.
      </p>
      <LineFamilyCard family="metro" lines={metro_lines} />
    </div>
  );
}
