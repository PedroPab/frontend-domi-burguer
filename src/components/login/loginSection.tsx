"use client";

import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "../ui/input";
import { GoogleIcon } from "../ui/icons";
import { Separator } from "../ui/separator";
import { signInWithPhoneNumber, RecaptchaVerifier, GoogleAuthProvider, signInWithPopup, linkWithPhoneNumber, ConfirmationResult } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuth } from "@/contexts/AuthContext";

interface LoginSectionProps {
    onClose: () => void;
}

export const LoginSection = ({ onClose }: LoginSectionProps) => {
    const { user } = useAuth();
    // Configurar el idioma de Firebase Auth
    useEffect(() => {
        auth.languageCode = "es";
    }, []);

    const [phone, setPhone] = useState("");
    const [code, setCode] = useState("");
    let recaptchaVerifierRef
    const [step, setStep] = useState<"phone" | "code">("phone");
    const [sending, setSending] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [timeLeft, setTimeLeft] = useState(0);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (step === "code") {
            setTimeLeft(15 * 60);
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

    const formatMMSS = (total: number) => {
        const m = Math.floor(total / 60).toString().padStart(2, "0");
        const s = (total % 60).toString().padStart(2, "0");
        return `${m}:${s}`;
    };

    const handleSendCode = async () => {
        try {
            setError(null);
            setSending(true);

            const normalized = "+57" + phone.replace(/\D/g, "");
            if (normalized.length < 10) {
                throw new Error("Ingresa un número de teléfono válido.");
            }
            console.log("Número de teléfono normalizado:", normalized);
            // Crear una nueva instancia de RecaptchaVerifier si no existe
            console.log(recaptchaVerifierRef)
            if (!recaptchaVerifierRef) {
                console.log("Creando nueva instancia de reCAPTCHA");
                recaptchaVerifierRef = new RecaptchaVerifier(
                    auth,
                    "send-code-btn",
                    {
                        size: "invisible",
                        callback: (response) => {
                            console.log(response)
                            console.log("reCAPTCHA resuelto correctamente");
                        },
                    }
                );

                console.log("Instancia de reCAPTCHA creada");
                console.log(recaptchaVerifierRef)

                // Asegurarse de que el reCAPTCHA está renderizado
                await recaptchaVerifierRef.render();
            }
            console.log("reCAPTCHA renderizado");
            try {
                console.log("Código enviado, ConfirmationResult:", auth,
                    normalized,
                    recaptchaVerifierRef);
                const confirmationResult = await signInWithPhoneNumber(
                    auth,
                    normalized,
                    recaptchaVerifierRef
                );

                confirmationResultRef.current = confirmationResult;

            } catch (error) {
                console.error("Error during signInWithPhoneNumber:", error);
                throw error;
            }

            // Guardar el resultado en una variable del componente
            setStep("code");
        } catch (error: any) {
            console.error("Error al enviar el código:", error);
            setError(error.message || "No se pudo enviar el SMS.");

            // Limpiar y reiniciar el reCAPTCHA
            recaptchaVerifierRef.current?.clear();
            recaptchaVerifierRef.current = null;
        } finally {
            setSending(false);
        }
    };

    const [confirmationResultRef] = useState<{ current: ConfirmationResult | null }>({ current: null });

    const handleVerifyCode = async () => {
        try {
            setError(null);
            setVerifying(true);

            if (!confirmationResultRef.current) {
                throw new Error("Por favor, solicita un nuevo código.");
            }

            if (user) {
                // Vincular el número de teléfono a la cuenta existente
                await confirmationResultRef.current.confirm(code);
                console.log("Número de teléfono vinculado con éxito.");
                onClose();
            } else {
                // Iniciar sesión con el número de teléfono
                const result = await confirmationResultRef.current.confirm(code);
                if (result.user) {
                    console.log("Usuario autenticado:", result.user);
                    onClose();
                }
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Código inválido o expirado.";
            setError(errorMessage);
        } finally {
            setVerifying(false);
        }
    };

    const handleResend = async () => {
        await handleSendCode();
    };

    const handleGoogleSignIn = async () => {
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log("Usuario autenticado con Google:", user);
            onClose();
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : "Error al iniciar sesión con Google";
            console.error("Error de autenticación con Google:", error);
            setError(errorMessage);
        }
    };

    return (
        <div className="flex mt-6 lg:mt-0 flex-col rounded-2xl px-[30px] lg:px-[140px] w-full justify-center gap-6 h-full bg-[#F7F7F7]">
            <h2 className="font-bold text-[20px]! md:text-[24px]! leading-[22px]! md:leading-[26px]! text-neutral-black-80">
                INICIA SESIÓN
            </h2>

            <p className="body-font">
                {step === "phone"
                    ? "Ingresa tu número de celular para enviarte un código por SMS."
                    : "¡Te enviamos un código de verificación! Escríbelo para continuar."}
            </p>

            {!!error && <div className="text-red-600 text-sm -mt-2">{error}</div>}

            <div className="flex flex-col gap-4">
                {/* Teléfono */}
                <div
                    className={`w-full pl-6 pr-0 py-0 flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] ${step === "code" ? "opacity-60 pointer-events-none" : ""
                        }`}
                >
                    <div className="text-sm relative w-fit [font-family:'Montserrat',Helvetica] font-bold text-neutrosblack-80 tracking-[0] leading-[18px] whitespace-nowrap">
                        +57
                    </div>
                    <div className="bg-[#cccccc] ml-6 w-[1px] h-full rotate-180" />
                    <Input
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="322  55  67  23"
                        className="border-none shadow-none w-full"
                    />
                </div>

                {/* Código */}
                <Input
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    maxLength={6}
                    disabled={step !== "code"}
                    className="gap-4 px-5 py-0 self-stretch w-full flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] tracking-[0.8em] space-x-3 bg-transparent text-neutral-black-50! font-normal! leading-[18px] text-center text-[20px]!"
                    placeholder="000000"
                    style={{ fontFamily: "Montserrat, Helvetica" }}
                />

                {/* Temporizador */}
                <div className="flex justify-between px-5">
                    <p
                        style={{ fontFamily: "Montserrat, Helvetica" }}
                        className="body-font"
                    >
                        Código válido por
                    </p>
                    <span className="body-font font-bold">
                        {step === "code" ? formatMMSS(timeLeft) : "15:00"}
                    </span>
                </div>

                {/* Botones de acción */}
                {step === "phone" && (
                    <Button
                        id="send-code-btn"
                        onClick={handleSendCode}
                        disabled={sending || !phone}
                        className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
                    >
                        {sending ? "Enviando..." : "ENVIAR CÓDIGO"}
                    </Button>
                )}

                {step === "code" && (
                    <>
                        <Button
                            onClick={handleVerifyCode}
                            disabled={verifying || code.length < 6}
                            className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
                        >
                            {verifying ? "Verificando..." : "VERIFICAR"}
                        </Button>

                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={sending}
                            className="text-sm underline self-center text-neutral-600"
                        >
                            ¿No recibiste el código? Reenviar
                        </button>
                    </>
                )}

                {/* Separador y botón de Google */}
                <div className="flex items-center gap-5 mb-2">
                    <Separator className="h-[2.2px] flex-1 grow" />
                    <span className="body-font text-neutral-black-50!">O ingresa con</span>
                    <Separator className="h-[2.2px] flex-1 grow" />
                </div>

                <Button
                    variant={"outline"}
                    onClick={handleGoogleSignIn}
                    className="text-neutral-black-80 hover:text-neutral-black-60 rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
                >
                    <GoogleIcon /> Continuar con Google
                </Button>
            </div>

            <div id="recaptcha-container" className="hidden" />
        </div>
    );
};