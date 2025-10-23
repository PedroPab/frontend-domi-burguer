"use client";

import { useState, useEffect } from "react";

interface StoreStatus {
  isOpen: boolean;
  message: string;
  opensAt?: string;
  closesAt?: string;
}

export const useStoreHours = () => {
  const [storeStatus, setStoreStatus] = useState<StoreStatus>({
    isOpen: true,
    message: "",
  });

  const checkStoreHours = (): StoreStatus => {
    // Obtener hora actual de Colombia

    return {
      isOpen: false,
      message: "Ya estamos cerrados por hoy",
      opensAt: "Mañana a las 4:30 PM",
    };
    
    const now = new Date();
    const colombiaTime = new Intl.DateTimeFormat("es-CO", {
      timeZone: "America/Bogota",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      weekday: "long",
    });

    const parts = colombiaTime.formatToParts(now);
    const weekday = parts.find((p) => p.type === "weekday")?.value || "";
    const hour = parseInt(parts.find((p) => p.type === "hour")?.value || "0");
    const minute = parseInt(
      parts.find((p) => p.type === "minute")?.value || "0"
    );

    // Convertir hora actual a minutos desde medianoche
    const currentMinutes = hour * 60 + minute;

    // Horarios de la tienda
    const OPENING_TIME = 16 * 60 + 30; // 4:30 PM = 16:30 = 990 minutos
    const CLOSING_TIME = 22 * 60; // 10:00 PM = 22:00 = 1320 minutos

    // Verificar si es domingo
    if (weekday.toLowerCase() === "domingo") {
      return {
        isOpen: false,
        message: "Estamos cerrados los domingos",
        opensAt: "Lunes a las 4:30 PM",
      };
    }

    // Verificar si está dentro del horario
    if (currentMinutes >= OPENING_TIME && currentMinutes < CLOSING_TIME) {
      return {
        isOpen: true,
        message: "Estamos abiertos",
        closesAt: "10:00 PM",
      };
    }

    // Si es antes de abrir
    if (currentMinutes < OPENING_TIME) {
      return {
        isOpen: false,
        message: "Aún no hemos abierto",
        opensAt: "4:30 PM",
      };
    }

    // Si es después de cerrar
    return {
      isOpen: false,
      message: "Ya estamos cerrados por hoy",
      opensAt: "Mañana a las 4:30 PM",
    };
  };

  useEffect(() => {
    // Verificar inmediatamente
    setStoreStatus(checkStoreHours());

    // Verificar cada minuto
    const interval = setInterval(() => {
      setStoreStatus(checkStoreHours());
    }, 60000); // 60000ms = 1 minuto

    return () => clearInterval(interval);
  }, []);

  return storeStatus;
};