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
} from "lucide-react";

// ✅ Firebase Auth (Phone linking)
import {
    getAuth,
    RecaptchaVerifier,
    PhoneAuthProvider,
    linkWithCredential,
} from "firebase/auth";

export default function ProfilePage() {
    const { user, loading, logout } = useAuth();
    const router = useRouter();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    // ✅ Phone states
    const auth = getAuth();
    const [phoneInput, setPhoneInput] = useState("+57");
    const [smsCode, setSmsCode] = useState("");
    const [verificationId, setVerificationId] = useState<string | null>(null);

    const [isSendingCode, setIsSendingCode] = useState(false);
    const [isLinkingPhone, setIsLinkingPhone] = useState(false);
    const [phoneMsg, setPhoneMsg] = useState<string>("");

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Si cambia el usuario y ya tiene phone, lo ponemos en el input
    useEffect(() => {
        if (user?.phoneNumber) setPhoneInput(user.phoneNumber);
    }, [user?.phoneNumber]);

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

    // ✅ reCAPTCHA helper (obligatorio en web)
    type WindowWithRecaptcha = Window & {
        recaptchaVerifier?: RecaptchaVerifier;
    };

    const getOrCreateRecaptcha = () => {
        const w = window as WindowWithRecaptcha;

        if (!w.recaptchaVerifier) {
            w.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
            });
        }
        return w.recaptchaVerifier as RecaptchaVerifier;
    };

    // ✅ 1) Enviar SMS
    const handleSendSmsCode = async () => {
        try {
            setPhoneMsg("");
            setIsSendingCode(true);

            if (!auth.currentUser) throw new Error("No hay usuario autenticado.");
            if (!phoneInput.startsWith("+")) {
                throw new Error(
                    "El teléfono debe empezar por + y estar en formato internacional. Ej: +573001112233"
                );
            }

            const recaptchaVerifier = getOrCreateRecaptcha();
            const provider = new PhoneAuthProvider(auth);

            const vid = await provider.verifyPhoneNumber(phoneInput, recaptchaVerifier);

            setVerificationId(vid);
            setPhoneMsg("Código enviado por SMS. Escríbelo abajo para confirmar.");
        } catch (e: unknown) {
            if (e instanceof Error) {
                setPhoneMsg(e.message);
            } else if (typeof e === "object" && e !== null && "message" in e) {
                setPhoneMsg(String((e as { message?: string }).message));
            } else {
                setPhoneMsg("Error enviando el código SMS.");
            }
        } finally {
            setIsSendingCode(false);
        }
    };

    // ✅ 2) Confirmar y vincular Phone al usuario actual
    const handleConfirmAndLinkPhone = async () => {
        try {
            setPhoneMsg("");
            setIsLinkingPhone(true);

            if (!auth.currentUser) throw new Error("No hay usuario autenticado.");
            if (!verificationId) throw new Error("Primero envía el código SMS.");
            if (!smsCode || smsCode.length < 4) throw new Error("Código SMS inválido.");

            const cred = PhoneAuthProvider.credential(verificationId, smsCode);

            await linkWithCredential(auth.currentUser, cred);

            // recargar usuario para que phoneNumber aparezca
            await auth.currentUser.reload();

            setPhoneMsg("✅ Teléfono verificado y agregado a tu cuenta.");
            setSmsCode("");
            setVerificationId(null);

            // si tu AuthContext no re-renderiza, esto fuerza refresco
            router.refresh();
        } catch (e: unknown) {
            if (
                typeof e === "object" &&
                e !== null &&
                "code" in e &&
                (e as { code?: string }).code === "auth/credential-already-in-use"
            ) {
                setPhoneMsg(
                    "Ese número ya está en uso por otra cuenta. Usa ese teléfono para iniciar sesión o cambia el número."
                );
            } else if (e instanceof Error) {
                setPhoneMsg(e.message);
            } else if (typeof e === "object" && e !== null && "message" in e) {
                setPhoneMsg(String((e as { message?: string }).message));
            } else {
                setPhoneMsg("Error verificando el código.");
            }
        } finally {
            setIsLinkingPhone(false);
        }
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
                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                            <div className="flex items-start gap-3 w-full">
                                <div className="w-10 h-10 bg-primary-red/10 rounded-full flex items-center justify-center mt-1">
                                    <Phone className="w-5 h-5 text-primary-red" />
                                </div>

                                <div className="w-full">
                                    <p className="text-sm text-neutral-black-60">Teléfono</p>

                                    <div className="space-y-2">
                                        <p className="font-medium text-neutral-black-80">
                                            {user.phoneNumber || "No proporcionado"}
                                        </p>

                                        {/* ✅ Obligatorio: contenedor del reCAPTCHA */}
                                        <div id="recaptcha-container" />

                                        {/* ✅ Solo mostrar el flujo si NO tiene teléfono */}
                                        {!user.phoneNumber && (
                                            <div className="space-y-2">
                                                <input
                                                    className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white"
                                                    value={phoneInput}
                                                    onChange={(e) => setPhoneInput(e.target.value)}
                                                    placeholder="+573001112233"
                                                />

                                                {!verificationId ? (
                                                    <Button
                                                        onClick={handleSendSmsCode}
                                                        disabled={isSendingCode}
                                                        className="h-10"
                                                    >
                                                        {isSendingCode ? "Enviando..." : "Enviar código SMS"}
                                                    </Button>
                                                ) : (
                                                    <div className="space-y-2">
                                                        <input
                                                            className="w-full h-10 px-3 rounded-md border border-gray-200 bg-white"
                                                            value={smsCode}
                                                            onChange={(e) => setSmsCode(e.target.value)}
                                                            placeholder="Código SMS"
                                                        />

                                                        <Button
                                                            onClick={handleConfirmAndLinkPhone}
                                                            disabled={isLinkingPhone}
                                                            className="h-10"
                                                        >
                                                            {isLinkingPhone ? "Verificando..." : "Confirmar y vincular"}
                                                        </Button>
                                                    </div>
                                                )}

                                                {phoneMsg && (
                                                    <p className="text-sm text-neutral-black-60">{phoneMsg}</p>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <ChevronRight className="w-5 h-5 text-neutral-black-60" />
                        </div>
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
        </div>
    );
}
