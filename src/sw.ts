import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: defaultCache,
  fallbacks: {
    entries: [
      {
        url: "/offline",
        matcher({ request }) {
          return request.destination === "document";
        },
      },
    ],
  },
});

serwist.addEventListeners();

/**
 * Web Push Notifications Handler
 * Maneja notificaciones push nativas (independiente de Firebase)
 */

interface PushData {
  title?: string;
  body?: string;
  icon?: string;
  badge?: string;
  image?: string;
  url?: string;
  orderId?: string;
  tag?: string;
  data?: Record<string, string>;
}

// Manejar evento push (notificación recibida)
self.addEventListener("push", (event: PushEvent) => {
  if (!event.data) return;

  let data: PushData;
  try {
    data = event.data.json();
  } catch {
    data = { body: event.data.text() };
  }

  const title = data.title || "Domi Burguer";
  const options: NotificationOptions = {
    body: data.body || "",
    icon: data.icon || "/icons/icon-192x192.png",
    badge: data.badge || "/icons/icon-72x72.png",
    tag: data.tag || data.orderId || "default",
    data: {
      url: data.url || "/",
      orderId: data.orderId,
      ...data.data,
    },
    requireInteraction: !!data.orderId, // Mantener visible si es de pedido
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Manejar click en notificación
self.addEventListener("notificationclick", (event: NotificationEvent) => {
  event.notification.close();

  const data = event.notification.data || {};
  let urlToOpen = data.url || "/";

  // Si tiene orderId, ir a la página del pedido
  if (data.orderId) {
    urlToOpen = `/orders/${data.orderId}`;
  }

  event.waitUntil(
    self.clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Buscar ventana existente
      for (const client of clientList) {
        if ("focus" in client && "navigate" in client) {
          client.focus();
          return (client as WindowClient).navigate(urlToOpen);
        }
      }
      // Abrir nueva ventana
      return self.clients.openWindow(urlToOpen);
    })
  );
});
