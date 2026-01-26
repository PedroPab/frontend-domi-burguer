"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { AuthService } from "@/services/authService";
import {
    PhoneAuthProvider,
    RecaptchaVerifier,
    linkWithCredential,
    unlink,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface PhoneVerificationModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Modo del modal: 'link' para vincular nuevo número, 'change' para cambiar número existente */
    mode?: "link" | "change";
    /** Callback cuando se completa la verificación exitosamente */
    onSuccess?: (phoneNumber: string) => void;
}

type WindowWithRecaptcha = Window & {
    recaptchaVerifier?: RecaptchaVerifier;
};

/**
 * Modal para verificar y vincular número de teléfono a la cuenta del usuario
 */
export const PhoneVerificationModal: React.FC<PhoneVerificationModalProps> = ({
    open,
    onOpenChange,
    mode = "link",
    onSuccess,
}) => {
    const { user, error, clearError } = useAuth();

    // Estado del formulario
    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    const [step, setStep] = useState<"phone" | "code">("phone");

    // Estado de procesamiento
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [unlinking, setUnlinking] = useState(false);

    // Estado de mensajes
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Verification ID para vincular
    const [verificationId, setVerificationId] = useState<string | null>(null);

    // Temporizador
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // ID único para el contenedor de recaptcha en este modal
    const recaptchaContainerId = "phone-modal-recaptcha";

    // Resetear estado cuando se abre/cierra el modal
    useEffect(() => {
        if (open) {
            setPhone("");
            setCode("");
            setStep("phone");
            setErrorMsg(null);
            setSuccessMsg(null);
            setVerificationId(null);
            clearError();
        } else {
            // Limpiar timer al cerrar
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        }
    }, [open, clearError]);

    // Efecto para el temporizador cuando se envía el código
    useEffect(() => {
        if (step === "code") {
            setTimeLeft(15 * 60); // 15 minutos en segundos

            if (timerRef.current) clearInterval(timerRef.current);

            timerRef.current = setInterval(() => {
                setTimeLeft((s) => {
                    if (s <= 1) {
                        if (timerRef.current) clearInterval(timerRef.current);
                        return 0;
                    }
                    return s - 1;
                });
            }, 1000);
        }

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [step]);

    // Formatear tiempo como MM:SS
    const formatMMSS = (total: number) => {
        const m = Math.floor(total / 60)
            .toString()
            .padStart(2, "0");
        const s = (total % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    // Normalizar número de teléfono
    const normalizePhone = (phoneValue: string): string => {
        const cleaned = phoneValue.replace(/\D/g, "");
        return "+57" + cleaned;
    };

    // Obtener o crear RecaptchaVerifier
    const getOrCreateRecaptcha = (): RecaptchaVerifier => {
        const w = window as WindowWithRecaptcha;

        if (w.recaptchaVerifier) {
            try {
                w.recaptchaVerifier.clear();
            } catch {
                // Ignorar errores al limpiar
            }
        }

        w.recaptchaVerifier = new RecaptchaVerifier(auth, recaptchaContainerId, {
            size: "invisible",
        });

        return w.recaptchaVerifier;
    };

    // Enviar código de verificación
    const handleSendCode = async () => {
        if (!user) {
            setErrorMsg("Debes iniciar sesión para verificar tu teléfono.");
            return;
        }

        try {
            setErrorMsg(null);
            setSuccessMsg(null);
            setSending(true);

            const normalized = normalizePhone(phone);
            if (normalized.length < 12) {
                throw new Error("Ingresa un número de teléfono válido.");
            }

            const recaptchaVerifier = getOrCreateRecaptcha();
            const provider = new PhoneAuthProvider(auth);

            const vid = await provider.verifyPhoneNumber(normalized, recaptchaVerifier);

            setVerificationId(vid);
            setStep("code");
            setSuccessMsg("Código enviado por SMS. Escríbelo abajo para confirmar.");
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErrorMsg(e.message);
            } else if (typeof e === "object" && e !== null && "message" in e) {
                setErrorMsg(String((e as { message?: string }).message));
            } else {
                setErrorMsg("Error enviando el código SMS.");
            }
        } finally {
            setSending(false);
        }
    };

    // Verificar código y vincular teléfono
    const handleVerifyAndLink = async () => {
        if (!user) {
            setErrorMsg("Debes iniciar sesión para verificar tu teléfono.");
            return;
        }

        if (!verificationId) {
            setErrorMsg("Primero envía el código SMS.");
            return;
        }

        try {
            setErrorMsg(null);
            setSuccessMsg(null);
            setVerifying(true);

            if (!code || code.length < 6) {
                throw new Error("El código debe tener 6 dígitos.");
            }

            // Si es modo cambio, primero desvincular el teléfono anterior
            if (mode === "change" && user.phoneNumber) {
                try {
                    await unlink(user, "phone");
                } catch {
                    // Si falla el unlink, continuar de todas formas
                    console.warn("No se pudo desvincular el teléfono anterior");
                }
            }

            // Crear credencial y vincular
            const credential = PhoneAuthProvider.credential(verificationId, code);
            await linkWithCredential(user, credential);

            // Recargar usuario para obtener el phoneNumber actualizado
            await user.reload();

            setSuccessMsg("Teléfono verificado y vinculado exitosamente.");

            // Callback de éxito
            if (onSuccess) {
                onSuccess(normalizePhone(phone));
            }

            // Cerrar modal después de un momento
            setTimeout(() => {
                onOpenChange(false);
            }, 1500);
        } catch (e: unknown) {
            if (
                typeof e === "object" &&
                e !== null &&
                "code" in e &&
                (e as { code?: string }).code === "auth/credential-already-in-use"
            ) {
                setErrorMsg(
                    "Ese número ya está en uso por otra cuenta. Usa otro número de teléfono."
                );
            } else if (
                typeof e === "object" &&
                e !== null &&
                "code" in e &&
                (e as { code?: string }).code === "auth/invalid-verification-code"
            ) {
                setErrorMsg("El código de verificación no es válido.");
            } else if (e instanceof Error) {
                setErrorMsg(e.message);
            } else if (typeof e === "object" && e !== null && "message" in e) {
                setErrorMsg(String((e as { message?: string }).message));
            } else {
                setErrorMsg("Error verificando el código.");
            }
        } finally {
            setVerifying(false);
        }
    };

    // Reenviar código
    const handleResend = () => {
        setCode("");
        setStep("phone");
        setVerificationId(null);
        setErrorMsg(null);
        setSuccessMsg(null);
    };

    // Desvincular teléfono actual (solo en modo change)
    const handleUnlinkPhone = async () => {
        if (!user || !user.phoneNumber) return;

        try {
            setUnlinking(true);
            setErrorMsg(null);

            await unlink(user, "phone");
            await user.reload();

            setSuccessMsg("Teléfono desvinculado. Ahora puedes agregar uno nuevo.");
        } catch (e: unknown) {
            if (e instanceof Error) {
                setErrorMsg(e.message);
            } else {
                setErrorMsg("Error al desvincular el teléfono.");
            }
        } finally {
            setUnlinking(false);
        }
    };

    const title = mode === "change" ? "Cambiar número de teléfono" : "Verificar teléfono";
    const description =
        mode === "change"
            ? "Ingresa tu nuevo número de teléfono para vincularlo a tu cuenta."
            : "Inicia sesión o regístrate con tu número de celular.";

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent onOpenChange={onOpenChange} className="sm:max-w-md">
                <DialogHeader className="px-6 pt-6">
                    <DialogTitle className="text-center text-xl font-semibold">
                        {title}
                    </DialogTitle>
                    <DialogDescription className="text-center text-neutral-black-60">
                        {description}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col w-full gap-4 px-6 pb-6">
                    {/* Mensaje de error */}
                    {(errorMsg || error) && (
                        <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg">
                            {errorMsg || error?.message}
                        </div>
                    )}

                    {/* Mensaje de éxito */}
                    {successMsg && (
                        <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg">
                            {successMsg}
                        </div>
                    )}

                    {/* Mostrar teléfono actual si está en modo cambio */}
                    {mode === "change" && user?.phoneNumber && (
                        <div className="bg-gray-50 p-3 rounded-lg">
                            <p className="text-sm text-neutral-black-60">Teléfono actual:</p>
                            <p className="font-medium">{user.phoneNumber}</p>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleUnlinkPhone}
                                disabled={unlinking}
                                className="mt-2 text-red-600 border-red-200 hover:bg-red-50"
                            >
                                {unlinking ? "Desvinculando..." : "Desvincular teléfono"}
                            </Button>
                        </div>
                    )}

                    {/* Campo de teléfono */}
                    <div
                        className={`w-full pl-6 pr-0 py-0 flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] ${
                            step === "code" ? "opacity-60 pointer-events-none" : ""
                        }`}
                    >
                        <div className="text-sm relative w-fit font-bold text-neutrosblack-80 tracking-[0] leading-[18px] whitespace-nowrap">
                            +57
                        </div>
                        <div className="bg-[#cccccc] ml-6 w-[1px] h-full rotate-180" />
                        <Input
                            inputMode="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                            placeholder="000 000 00 00"
                            className="border-none shadow-none w-full"
                            disabled={step === "code"}
                        />
                    </div>

                    {/* Campo de código */}
                    <Input
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                        maxLength={6}
                        disabled={step !== "code"}
                        className="gap-4 px-5 py-0 self-stretch w-full flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] tracking-[0.5em] bg-transparent text-neutral-black-80 font-normal leading-[18px] text-center text-xl disabled:opacity-50"
                        placeholder="0 0 0 0 0 0"
                    />

                    {/* Temporizador */}
                    <div className="flex justify-between px-5">
                        <p className="text-sm text-neutral-black-60">Código válido por</p>
                        <span className="text-sm font-bold">
                            {step === "code" ? formatMMSS(timeLeft) : "15:00"}
                        </span>
                    </div>

                    {/* Botones de acción */}
                    {step === "phone" && (
                        <Button
                            onClick={handleSendCode}
                            disabled={sending || !phone || phone.length < 10}
                            className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
                        >
                            {sending ? "Enviando..." : "ENVIAR CÓDIGO"}
                        </Button>
                    )}

                    {step === "code" && (
                        <>
                            <Button
                                onClick={handleVerifyAndLink}
                                disabled={verifying || code.length < 6 || timeLeft === 0}
                                className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
                            >
                                {verifying ? "Verificando..." : "VERIFICAR"}
                            </Button>

                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={sending}
                                className="text-sm underline self-center text-neutral-600 hover:text-neutral-800"
                            >
                                ¿No recibiste el código? Reenviar
                            </button>
                        </>
                    )}

                    {/* Contenedor para el recaptcha (hidden) */}
                    <div id={recaptchaContainerId} />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default PhoneVerificationModal;
