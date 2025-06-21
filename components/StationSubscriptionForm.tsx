"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { EquipmentType } from "@prisma/client";

type Frequency = "IMMEDIATE" | "DAILY" | "WEEKLY";

type StationSubscriptionFormProps = {
  stationSlug: string;
  availableTypes: EquipmentType[];
  onSubmit: (data: { types: string[]; frequency: Frequency }) => void;
};

export function StationSubscriptionForm({
  stationSlug,
  availableTypes,
  onSubmit,
}: StationSubscriptionFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([...availableTypes]);

  const [frequency, setFrequency] = useState<Frequency>("IMMEDIATE");

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = () => {
    onSubmit({
      types: selectedTypes,
      frequency: frequency,
    });
  };

  return (
    <div className="border-t mt-4 pt-3 space-y-3">
      <p className="text-sm font-medium">🔔 Abonnement aux alertes</p>

      <div className="space-y-2">
        {availableTypes.map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <Checkbox
              id={type}
              checked={selectedTypes.includes(type)}
              onCheckedChange={() => toggleType(type)}
            />
            <Label htmlFor={type} className="capitalize text-sm">
              {type.toLowerCase()}
            </Label>
          </div>
        ))}
      </div>

      <div className="pt-2">
        <Label className="text-sm mb-1 block">Fréquence</Label>
         <select value={frequency} onChange={(e) => setFrequency(e.target.value as "IMMEDIATE" | "DAILY" | "WEEKLY")}>
            <option value="IMMEDIATE">Immédiat</option>
            <option value="DAILY">Quotidien</option>
            <option value="WEEKLY">Hebdomadaire</option>
            </select>
      </div>

      <Button className="mt-2" onClick={handleSubmit}>
        S’abonner
      </Button>
    </div>
  );
}
