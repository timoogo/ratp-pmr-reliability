"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";  
import { Label } from "@/components/ui/label";
import { EquipmentType, SubscriptionFrequency } from "@/types/equipement";
import { toast } from "sonner";

type StationSubscriptionFormProps = {
  stationSlug: string;
  availableTypes: EquipmentType[];
  initialTypes: string[];
  initialFrequency: SubscriptionFrequency;
  onSubmit: (data: { types: string[]; frequency: SubscriptionFrequency }) => void;
};

export function StationSubscriptionForm({
  stationSlug,
  availableTypes,
  initialTypes,
  initialFrequency,
  onSubmit,
}: StationSubscriptionFormProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [frequency, setFrequency] = useState<SubscriptionFrequency>(SubscriptionFrequency.IMMEDIATE);

  // Synchroniser les états avec les props initiales à chaque changement
  useEffect(() => {
    setSelectedTypes(initialTypes);
  }, [initialTypes]);

  useEffect(() => {
    setFrequency(initialFrequency);
  }, [initialFrequency]);

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    if (selectedTypes.length === 0) {
      toast.error("Merci de sélectionner au moins un type d’équipement");
      return;
    }
    try {
      await onSubmit({ types: selectedTypes, frequency });
      toast.success("Abonnement enregistré avec succès");
    } catch (err) {
      toast.error("Erreur lors de l'enregistrement de l'abonnement");
      console.error(err);
    }
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
        <select
          value={frequency}
          onChange={(e) => setFrequency(e.target.value as SubscriptionFrequency)}
          className="w-full max-w-xs"
        >
            <option value={SubscriptionFrequency.IMMEDIATE}>Immédiat</option>
          <option value={SubscriptionFrequency.DAILY}>Quotidien</option>
          <option value={SubscriptionFrequency.WEEKLY}>Hebdomadaire</option>
        </select>
      </div>

      <Button className="mt-2" onClick={handleSubmit}>
        S’abonner
      </Button>
    </div>
  );
}
