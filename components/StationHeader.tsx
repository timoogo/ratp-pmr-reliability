import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Station } from "@prisma/client";
import Link from "next/link";

type StationStatus = "DISPONIBLE" | "PARTIEL" | "INDISPONIBLE";

type StationHeaderProps = {
  station: Pick<Station, "name" | "slug" | "family" | "line">;
  available: number;
  total: number;
  status: StationStatus;
  lastUpdate?: string;
  isUpdated?: boolean;
};

export function StationHeader({
  station,
  available,
  total,
  status,
  lastUpdate,
}: StationHeaderProps) {
  const getDotColor = () => {
    const base =
      status === "DISPONIBLE"
        ? "bg-green-500"
        : status === "PARTIEL"
        ? "bg-yellow-500"
        : "bg-red-500";

    if (!lastUpdate) return base;

    const age = Date.now() - new Date(lastUpdate).getTime();
    const isStale = age > 1000 * 60 * 60 * 12; // 12 heures

    return isStale ? "bg-gray-400" : base;
  };




  return (
<div
  className={cn(
    "px-4 py-2 w-full flex items-center justify-between transition-colors duration-300"
  )}
>
     <div className="flex items-center gap-2">
        <span className={cn("w-3 h-3 rounded-full", getDotColor())} />
        <Link href={`/etat-equipement/${station.family}/${station.line}/${station.slug}`} className="font-medium text-base">
          {station.name}
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline" className="ml-6 text-sm text-muted-foreground">
          {available} / {total} disponibles
        </Badge>
      </div>
    </div>
  );
}
