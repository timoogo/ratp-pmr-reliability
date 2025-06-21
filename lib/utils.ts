import { EquipmentType } from "@prisma/client";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Options = {
  plural?: boolean;
  singular?: boolean;
  lowercase?: boolean;
  uppercase?: boolean;
};

const equipmentNameMap: Record<EquipmentType, string> = {
  ASCENSEUR: "Ascenseur",
  ESCALATOR: "Escalator",
  PORTILLONS: "Portillon",
  CABINES: "Cabine",
};

function formatLabel(base: string, options?: Options): string {
  let result = base;

  if (options?.plural && !result.endsWith("s")) {
    result += "s";
  } else if (options?.singular && result.endsWith("s")) {
    result = result.slice(0, -1);
  }

  if (options?.lowercase) return result.toLowerCase();
  if (options?.uppercase) return result.toUpperCase();

  return result;
}

// Version générique
export function formatFromOptions<T extends string>(
  input: T,
  options?: Options
): { raw: T; label: string } {
  if (!input) {
    return { raw: input, label: "" };
  }

  const baseKey = input?.toUpperCase() as EquipmentType;

  const base = baseKey in equipmentNameMap ? equipmentNameMap[baseKey] : input;

  const label = formatLabel(base, options);
  return { raw: input, label };
}
