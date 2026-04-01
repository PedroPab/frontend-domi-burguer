"use client";

import { useState, useEffect, useCallback } from "react";
import { getFCMToken, onForegroundMessage } from "@/lib/firebase";
import {
  isWebPushSupported,
  getOrCreatePushSubscription,
  extractSubscriptionData,
  saveSubscriptionToBackend,
  PushSubscriptionData,
} from "@/lib/webPush";

interface NotificationPayload {
  notification?: {
    title?: string;
    body?: string;
  };
  data?: Record<string, string>;
}

type NotificationMethod = "webpush" | "firebase" | null;

interface UseNotificationsReturn {
  permission: NotificationPermission | "unsupported";
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  isSupported: boolean;
  method: NotificationMethod;
  // Datos de suscripción (para enviar al backend)
  subscription: PushSubscriptionData | null;
  fcmToken: string | null;
}

export function useNotifications(): UseNotificationsReturn {
  const [permission, setPermission] = useState<NotificationPermission | "unsupported">("default");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [method, setMethod] = useState<NotificationMethod>(null);
  const [subscription, setSubscription] = useState<PushSubscriptionData | null>(null);
  const [fcmToken, setFcmToken] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Verificar soporte
    const supported = "Notification" in window && "serviceWorker" in navigator;
    setIsSupported(supported);

    if (!supported) {
      setPermission("unsupported");
      return;
    }

    // Obtener permiso actual
    setPermission(Notification.permission);

    // Si ya tiene permiso, intentar obtener suscripción existente
    if (Notification.permission === "granted") {
      initializeExistingSubscription();
    }

    // Escuchar mensajes en foreground (Firebase)
    onForegroundMessage((payload) => {
      const notifPayload = payload as NotificationPayload;
      if (notifPayload.notification) {
        showForegroundNotification(
          notifPayload.notification.title || "Domi Burguer",
          notifPayload.notification.body
        );
      }
    });
  }, []);

  /**
   * Inicializar suscripción existente
   */
  const initializeExistingSubscription = async () => {
    // Intentar Web Push primero
    if (isWebPushSupported() && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
      const pushSub = await getOrCreatePushSubscription();
      if (pushSub) {
        const data = extractSubscriptionData(pushSub);
        if (data) {
          setSubscription(data);
          setMethod("webpush");
          return;
        }
      }
    }

    // Fallback a Firebase
    const token = await getFCMToken();
    if (token) {
      setFcmToken(token);
      setMethod("firebase");
    }
  };

  /**
   * Mostrar notificación cuando la app está en primer plano
   */
  const showForegroundNotification = (title: string, body?: string) => {
    new Notification(title, {
      body,
      icon: "/icons/icon-192x192.png",
      badge: "/icons/icon-72x72.png",
    });
  };

  /**
   * Solicitar permiso y suscribirse
   */
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!isSupported) {
      setError("Tu navegador no soporta notificaciones");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await Notification.requestPermission();
      setPermission(result);

      if (result !== "granted") {
        if (result === "denied") {
          setError("Permiso de notificaciones denegado");
        }
        return false;
      }

      // Intentar Web Push primero (más independiente)
      if (isWebPushSupported() && process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY) {
        const pushSub = await getOrCreatePushSubscription();
        if (pushSub) {
          const data = extractSubscriptionData(pushSub);
          if (data) {
            setSubscription(data);
            setMethod("webpush");
            await saveSubscriptionToBackend(data);
            console.log("✅ Web Push subscription created");
            return true;
          }
        }
      }

      // Fallback a Firebase
      console.log("⚠️ Web Push failed, trying Firebase...");
      const token = await getFCMToken();
      if (token) {
        setFcmToken(token);
        setMethod("firebase");
        localStorage.setItem("fcm_token", token);
        console.log("✅ Firebase token obtained");
        return true;
      }

      setError("No se pudo configurar las notificaciones");
      return false;
    } catch (err) {
      console.error("Error requesting notification permission:", err);
      setError("Error al solicitar permiso de notificaciones");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [isSupported]);

  return {
    permission,
    isLoading,
    error,
    requestPermission,
    isSupported,
    method,
    subscription,
    fcmToken,
  };
}
