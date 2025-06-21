export async function getSubscription(): Promise<PushSubscription | null> {
  if (!("serviceWorker" in navigator)) {
    console.warn("Service Worker non supporté");
    return null;
  }

  // Vérifie la permission AVANT tout
  if (Notification.permission === "denied") {
    console.warn("Permission de notification refusée");
    return null;
  }

  if (Notification.permission === "default") {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.warn("Permission de notification refusée");
      return null;
    }
  }

  const registration = await navigator.serviceWorker.ready;

  // Supprime l'ancien abonnement s'il existe
  const existingSub = await registration.pushManager.getSubscription();
  if (existingSub) {
    await existingSub.unsubscribe();
  }

  const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (typeof vapidPublicKey !== "string" || vapidPublicKey.length === 0) {
    throw new Error("La clé VAPID publique est absente ou invalide");
  }

  const convertedVapidKey = urlBase64ToUint8Array(vapidPublicKey);

  try {
    // Crée un nouvel abonnement unique
    const newSubscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: convertedVapidKey,
    });
    console.log("Nouvel abonnement push :", newSubscription.toJSON());
    return newSubscription;
  } catch (err) {
    console.error("Erreur d'abonnement aux notifications :", err);
    throw new Error("Impossible de s’abonner aux notifications push.");
  }
}

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
}
