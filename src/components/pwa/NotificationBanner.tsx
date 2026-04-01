"use client";

import { useState, useEffect } from "react";
import { X, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/hooks/useNotifications";

export function NotificationBanner() {
  const { permission, isLoading, requestPermission, isSupported } = useNotifications();
  const [isDismissed, setIsDismissed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const dismissed = localStorage.getItem("notification-banner-dismissed");
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10);
      // Mostrar de nuevo después de 30 días
      if (Date.now() - dismissedTime < 30 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true);
      }
    }
  }, []);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem("notification-banner-dismissed", Date.now().toString());
  };

  const handleEnable = async () => {
    const success = await requestPermission();
    if (success) {
      setIsDismissed(true);
    }
  };

  // No mostrar si:
  // - No está montado (SSR)
  // - No soporta notificaciones
  // - Ya tiene permiso
  // - Permiso denegado (no molestar más)
  // - Ya fue descartado
  if (
    !mounted ||
    !isSupported ||
    permission === "granted" ||
    permission === "denied" ||
    isDismissed
  ) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-[499] mx-auto max-w-md">
      <div className="bg-white rounded-2xl shadow-lg border border-neutral-200 p-4 flex items-center gap-4">
        <div className="flex-shrink-0 w-10 h-10 bg-primary-red/10 rounded-full flex items-center justify-center">
          <Bell className="w-5 h-5 text-primary-red" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-neutral-black-80">
            Activa las notificaciones
          </p>
          <p className="text-xs text-neutral-600 mt-0.5">
            Te avisamos cuando tu pedido este listo
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={handleEnable}
            disabled={isLoading}
            size="sm"
            className="h-9 px-4 rounded-[20px]"
          >
            {isLoading ? "..." : "Activar"}
          </Button>

          <button
            onClick={handleDismiss}
            className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-neutral-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
