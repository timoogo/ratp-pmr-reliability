// components/station/StationInfoCard.tsx
import Link from "next/link";
import { ContentCardWrapper } from "@/components/ContentCardWrapper";
import { Equipment } from "@/types/equipement";
import { EquipmentRow } from "./EquipmentRow";

export const StationInfoCard = ({
  name,
  line,
  family,
  equipments,
  type,
}: {
  name: string;
  line: string;
  family: string;
  equipments: Equipment[];
  type: string;
}) => {
  const lineColor = "bg-purple-700";

  return (
    <>
    <ContentCardWrapper className="p-0">
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Link
            href={`/etat-equipement/${family}/${line}`}
            className="text-blue-600 hover:text-blue-800"
          >
            ← Retour
          </Link>
          <span className="font-semibold uppercase">{name}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className={`w-6 h-6 rounded-full ${lineColor} text-white grid place-content-center text-xs font-extrabold`}>M</span>
          <span className={`w-6 h-6 rounded-full ${lineColor} text-white grid place-content-center text-xs font-extrabold`}>{line}</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 font-semibold text-sm text-gray-600 px-6 py-3">
        <div className="col-span-2">Type</div>
        <div className="col-span-7">Localisation</div>
        <div className="col-span-3 text-right">État de l’équipement</div>

      </div>

      {equipments.map((e) => (
        <EquipmentRow
          key={e.code}
          status={e.status}
          code={e.code}
          situation={(e as any).situation}          
          direction={(e as any).direction}
          family={family}
          line={line}
          station={name}
          type={type}
        />
      ))}
    </ContentCardWrapper>
    </>
  );
};
