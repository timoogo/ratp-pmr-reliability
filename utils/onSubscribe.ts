import { getSubscription } from "@/lib/webpush/registerSubscription";
import type { SubscriptionFrequency } from "@prisma/client";

type OnSubscribeParams = {
  stationSlug: string;
  selectedTypes: string[];
  frequency: SubscriptionFrequency;
};

export async function onSubscribe({
  stationSlug,
  selectedTypes,
  frequency,
}: OnSubscribeParams) {
  // Récupérer l'abonnement Push actuel (ou le créer si nécessaire)
  const subscription = await getSubscription();
  console.log("subscription", subscription);
  if (!subscription) {
    throw new Error("Impossible de récupérer l'abonnement push");
  }

  try {
    const res = await fetch("/api/push-subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stationSlug,
        types: selectedTypes,
        frequency,
        subscription,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error("Échec de l'abonnement :", text);
      throw new Error(`Erreur serveur : ${text}`);
    }

    return true;
  } catch (err) {
    console.error("Erreur réseau ou serveur lors de l'abonnement :", err);
    throw err;
  }
}
