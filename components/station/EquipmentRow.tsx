// components/station/EquipmentRow.tsx
import { EquipmentStatus } from "@/types/equipement";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type Props = {
  situation?: string;
  direction?: string;
  status: string;
  family: string;
  line: string;
  station: string;
  code: string;
  type: string;
};

const bgColor: Record<EquipmentStatus, string> = {
  [EquipmentStatus.DISPONIBLE]: "hover:bg-green-600/10",
  [EquipmentStatus.INDISPONIBLE]: "hover:bg-red-600/10",
  [EquipmentStatus.EN_MAINTENANCE]: "hover:bg-yellow-600/10",
};

export const EquipmentRow = ({
  situation,
  direction,
  status,
  family,
  line,
  station,
  code,
  type,
}: Props) => {
  const renderStatus = () => {
    switch (status) {
      case EquipmentStatus.DISPONIBLE:
        return (
          <>
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span>Disponible</span>
          </>
        );
      case EquipmentStatus.INDISPONIBLE:
        return (
          <>
            <XCircle className="w-4 h-4 text-red-600" />
            <span>Indisponible</span>
          </>
        );
      case EquipmentStatus.EN_MAINTENANCE:
        return (
          <>
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
            <span>{status}</span>
          </>
        );
    }
  };

  type = type.toLowerCase();
  station = station.toLowerCase();
  return (
    <Link
      href={`/etat-equipement/${family}/${line}/${station}/${type}/${code}`}
    >
      <div
        className={`grid grid-cols-12 gap-4 items-center px-6 py-4 border-t text-sm ${
          bgColor[status as EquipmentStatus]
        }`}
      >
        <div className="col-span-2">
          <div className="w-10 h-10 bg-blue-600/10 rounded grid place-content-center">
            <Image
              src="/picto/ascenseur.svg"
              alt="Ascenseur"
              width={44}
              height={44}
            />
          </div>
        </div>
        <div className="col-span-7 space-y-1">
          <p>
            <span className="font-semibold">Situation : </span>
            {situation || "—"}
          </p>
          <p>
            <span className="font-semibold">Direction : </span>
            {direction || "—"}
          </p>
        </div>
        <div className="col-span-3 flex items-center justify-end gap-2">
          {renderStatus()}
        </div>
      </div>
    </Link>
  );
};
