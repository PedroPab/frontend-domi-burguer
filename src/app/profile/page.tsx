"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary-red" size={70} />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-6">
      <h1 className="text-3xl font-bold">Perfil de Usuario</h1>
      <div className="flex flex-col items-center gap-4 p-6 border rounded-lg shadow-md">
        {user.photoURL && (
          <img
            src={user.photoURL}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full"
          />
        )}
        <p>
          <strong>Nombre:</strong> {user.displayName || "No disponible"}
        </p>
        <p>
          <strong>Email:</strong> {user.email || "No disponible"}
        </p>
        <p>
          <strong>Teléfono:</strong> {user.phoneNumber || "No disponible"}
        </p>
        <Button onClick={logout} className="mt-4">
          Cerrar Sesión
        </Button>
      </div>
    </div>
  );
}
