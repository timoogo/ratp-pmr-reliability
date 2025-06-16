// File: /components/ui/StationStepper.tsx
import { StationRow } from "@/components/StationRow";
import { EquipmentType } from "@prisma/client";
import {
  Stepper,
  StepperItem,
  StepperSeparator,
} from "@/components/ui/stepper";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

function getEquipmentType(type: keyof typeof EquipmentType) {
  switch (type) {
    case "ASCENSEUR":
      return "ascenseurs";
    case "ESCALATOR":
      return "escalators";
    case "PORTILLONS":
      return "portillons";
    case "CABINES":
      return "cabinets";
  }
}

export type StationStepperProps = {
  stations: {
    name: string;
    slug: string;
    line: string;
    family: "metro" | "rer" | "tramway" | "bus";
    stationOrder: number;
    lineSymbol: "M" | "RER" | "T" | "B";
    status: "ok" | "warning" | "current";
    type: EquipmentType;
  }[];
};

export const StationStepper = ({ stations }: StationStepperProps) => {
  return (
    <Stepper orientation="vertical" className="w-full">
      {stations.map((station, index) => (
        <StepperItem key={station.slug} step={index} className="relative">
          <Link
            href={`/etat-equipement/${station.family}/${station.line}/${station.slug}/${getEquipmentType(station.type)}`}
            className="flex w-full items-center no-underline"
          >
            <StationRow name={station.name} status={station.status} />

            <div className="absolute right-4">
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          </Link>

          {index < stations.length - 1 && <StepperSeparator />}
        </StepperItem>
      ))}
    </Stepper>
  );
};
