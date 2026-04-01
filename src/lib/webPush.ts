/**
 * Web Push Notifications - Independiente de Firebase
 *
 * Este servicio permite enviar notificaciones push sin depender de Firebase.
 * Usa la Web Push API nativa del navegador.
 */

export interface PushSubscriptionData {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

/**
 * Verificar si el navegador soporta Web Push
 */
export function isWebPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window
  );
}

/**
 * Convertir VAPID key de base64 a Uint8Array
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const buffer = new ArrayBuffer(rawData.length);
  const outputArray = new Uint8Array(buffer);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

/**
 * Obtener la suscripción actual o crear una nueva
 */
export async function getOrCreatePushSubscription(): Promise<PushSubscription | null> {
  if (!isWebPushSupported()) {
    console.warn("Web Push not supported");
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.ready;

    // Verificar si ya existe una suscripción
    let subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      return subscription;
    }

    // Crear nueva suscripción
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidPublicKey) {
      console.warn("VAPID public key not configured");
      return null;
    }

    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });

    return subscription;
  } catch (error) {
    console.error("Error getting push subscription:", error);
    return null;
  }
}

/**
 * Extraer datos de la suscripción para enviar al backend
 */
export function extractSubscriptionData(subscription: PushSubscription): PushSubscriptionData | null {
  const json = subscription.toJSON();

  if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) {
    return null;
  }

  return {
    endpoint: json.endpoint,
    keys: {
      p256dh: json.keys.p256dh,
      auth: json.keys.auth,
    },
  };
}

/**
 * Cancelar suscripción de notificaciones
 */
export async function unsubscribeFromPush(): Promise<boolean> {
  if (!isWebPushSupported()) return false;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();

    if (subscription) {
      await subscription.unsubscribe();
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error unsubscribing from push:", error);
    return false;
  }
}

/**
 * Guardar suscripción en el backend
 */
export async function saveSubscriptionToBackend(
  subscription: PushSubscriptionData,
  _userId?: string
): Promise<boolean> {
  try {
    // Guardar en localStorage como fallback
    localStorage.setItem("push_subscription", JSON.stringify(subscription));
    localStorage.setItem("push_subscription_endpoint", subscription.endpoint);

    // TODO: Descomentar cuando tengas el endpoint en tu backend
    // const response = await fetch('/api/notifications/subscribe', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     subscription,
    //     userId,
    //   }),
    // });
    // return response.ok;

    console.log("Push subscription saved:", subscription.endpoint.substring(0, 50) + "...");
    return true;
  } catch (error) {
    console.error("Error saving subscription to backend:", error);
    return false;
  }
}
