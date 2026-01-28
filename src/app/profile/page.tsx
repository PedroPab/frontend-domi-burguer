"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Loader2,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  LogOut,
  Edit,
  Shield,
  ChevronRight,
  Binary,
} from "lucide-react";
import { PhoneVerificationModal } from "@/components/phone/PhoneVerificationModal";

export default function ProfilePage() {
  const { user, loading, logout, reloadUser } = useAuth();
  const router = useRouter();

  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [phoneModalOpen, setPhoneModalOpen] = useState(false);
  const [phoneModalMode, setPhoneModalMode] = useState<"link" | "change">("link");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleOpenPhoneModal = (mode: "link" | "change") => {
    setPhoneModalMode(mode);
    setPhoneModalOpen(true);
  };

  const handlePhoneVerified = async () => {
    await reloadUser();
  };

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary-red" size={70} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-black-80 mb-2">
              Mi Cuenta
            </h1>
            <p className="text-neutral-black-60">
              Administra tu información personal y preferencias
            </p>
          </div>

          <Button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="h-11 px-4 flex items-center gap-2 rounded-lg text-white hover:bg-red-700 transition-colors"
            variant="destructive"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="animate-spin w-4 h-4" />
                Saliendo...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                Cerrar sesión
              </>
            )}
          </Button>
        </div>

        {/* Tarjeta de Perfil Principal */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.photoURL}
                  alt="Foto de perfil"
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary-red"
                />
              ) : (
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-primary-red to-orange-500 flex items-center justify-center border-4 border-white shadow-lg">
                  <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                </div>
              )}
              <button className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition-colors">
                <Edit className="w-4 h-4 text-neutral-black-60" />
              </button>
            </div>

            {/* Información Principal */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-bold text-neutral-black-80 mb-1">
                {user.displayName || "Usuario de DomiBurguer"}
              </h2>
              {user.email && (
                <p className="text-neutral-black-60 mb-4">{user.email}</p>
              )}

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {user.emailVerified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    <Shield className="w-4 h-4" />
                    Verificado
                  </span>
                )}
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  Usuario activo
                </span>

                {/* Badge de teléfono */}
                {user.phoneNumber && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    <Phone className="w-4 h-4" />
                    Teléfono verificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Información de Contacto */}
        <Card className="p-6 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-black-80 mb-4">
            Información de Contacto
          </h3>

          <div className="space-y-4">
            {/* Email */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-red/10 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-primary-red" />
                </div>
                <div>
                  <p className="text-sm text-neutral-black-60">Correo electrónico</p>
                  <p className="font-medium text-neutral-black-80">
                    {user.email || "No proporcionado"}
                  </p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </div>

            {/* Teléfono */}
            <button
              onClick={() => handleOpenPhoneModal(user.phoneNumber ? "change" : "link")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-red/10 rounded-full flex items-center justify-center">
                  <Phone className="w-5 h-5 text-primary-red" />
                </div>
                <div className="text-left">
                  <p className="text-sm text-neutral-black-60">Teléfono</p>
                  <p className="font-medium text-neutral-black-80">
                    {user.phoneNumber || "No proporcionado"}
                  </p>
                  {!user.phoneNumber && (
                    <p className="text-xs text-primary-red mt-1">
                      Toca para verificar tu número
                    </p>
                  )}
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </button>
          </div>
        </Card>

        {/* Información de la Cuenta */}
        <Card className="p-6 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-black-80 mb-4">
            Detalles de la Cuenta
          </h3>
          <div className="space-y-4">
            {/* Fecha de Creación */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-black-60">Miembro desde</p>
                <p className="font-medium text-neutral-black-80">
                  {formatDate(user.metadata.creationTime || null)}
                </p>
              </div>
            </div>

            {/* Último Acceso */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Calendar className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-neutral-black-60">Último acceso</p>
                <p className="font-medium text-neutral-black-80">
                  {formatDate(user.metadata.lastSignInTime || null)}
                </p>
              </div>
            </div>

            {/* ID de Usuario */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-purple-600" />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm text-neutral-black-60">ID de Usuario</p>
                <p className="font-mono text-sm text-neutral-black-80 truncate">
                  {user.uid}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Acciones Rápidas */}
        <Card className="p-6 mb-6 shadow-lg">
          <h3 className="text-xl font-bold text-neutral-black-80 mb-4">
            Acciones Rápidas
          </h3>
          <div className="space-y-3">
            <button
              onClick={() => router.push("/locations")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-primary-red" />
                <span className="font-medium text-neutral-black-80">Mis Direcciones</span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </button>

            <button
              onClick={() => router.push("/")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary-red" />
                <span className="font-medium text-neutral-black-80">Hacer un Pedido</span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </button>

            <button
              onClick={() => router.push("/orders")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary-red" />
                <span className="font-medium text-neutral-black-80">Mis Pedidos</span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </button>

            {/*Mis codigos */}
            <button
              onClick={() => router.push("/codes")}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Binary className="w-5 h-5 text-primary-red" />
                <span className="font-medium text-neutral-black-80">Mis Códigos</span>
              </div>
              <ChevronRight className="w-5 h-5 text-neutral-black-60" />
            </button>
          </div>
        </Card>

        {/* Botón de Cerrar Sesión */}
        <Button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full h-12 rounded-lg flex items-center justify-center gap-2 transition-colors border border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
          variant="outline"
        >
          {isLoggingOut ? (
            <>
              <Loader2 className="animate-spin w-5 h-5" />
              Cerrando sesión...
            </>
          ) : (
            <>
              <LogOut className="w-5 h-5" />
              Cerrar Sesión
            </>
          )}
        </Button>
      </div>

      {/* Modal de verificación de teléfono */}
      <PhoneVerificationModal
        open={phoneModalOpen}
        onOpenChange={setPhoneModalOpen}
        mode={phoneModalMode}
        onSuccess={handlePhoneVerified}
      />
    </div>
  );
}
