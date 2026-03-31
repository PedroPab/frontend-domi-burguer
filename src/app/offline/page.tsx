"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WifiOff } from "lucide-react";

export default function OfflinePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <WifiOff className="w-16 h-16 text-primary-red mb-6" />

      <h1 className="text-3xl font-bold mb-2 text-neutral-black-80">
        Sin conexion
      </h1>

      <p className="mb-4 text-neutral-600 max-w-md">
        Parece que no tienes conexion a internet. Verifica tu conexion e intenta de nuevo.
      </p>

      <p className="mb-8 text-neutral-500 text-sm">
        Mientras tanto, puedes revisar tu carrito si ya tenias productos agregados.
      </p>

      <div className="flex gap-4 flex-wrap justify-center">
        <Button
          onClick={() => window.location.reload()}
          className="h-12 px-6 rounded-[30px]"
        >
          Reintentar
        </Button>

        <Button
          variant="outline"
          className="h-12 px-6 rounded-[30px]"
          asChild
        >
          <Link href="/cart">
            Ver carrito
          </Link>
        </Button>
      </div>
    </div>
  );
}
