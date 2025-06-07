import { lineFamilyIcons } from "@/lib/lineFamilyIcons";
import Image from "next/image";
import Link from "next/link";
import { ContentCardWrapper } from "./ContentCardWrapper";

type LineFamilyCardProps = {
  family: "metro" | "rer" | "tramway";
  lines: {
    code: string;
    imageSrc: string;
    alt?: string;
    hasEquipementsForAccessibility?: boolean;
  }[];
};

export const LineFamilyCard = ({ family, lines }: LineFamilyCardProps) => {
  return (
    <ContentCardWrapper>
      <div className="flex items-center gap-2 mb-2">
        <Image
          src={lineFamilyIcons[family]}
          alt={family}
          width={24}
          height={24}
        />
        <span className="font-bold">{family}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {lines.map((line) => {
          const img = (
            <Image
              src={line.imageSrc}
              alt={line.alt ?? `Ligne ${line.code}`}
              width={32}
              height={32}
            />
          );

          return line.hasEquipementsForAccessibility ? (
            <Link
              key={line.code}
              href={`/etat-equipement/${family}/${line.code}`}
              className="inline-flex items-center justify-center p-[2px] rounded-full transition-all duration-300 hover:ring-2 hover:ring-blue-500"
            >
              {img}
            </Link>
          ) : (
            <div key={line.code}>{img}</div>
          );
        })}
      </div>
    </ContentCardWrapper>
  );
};
