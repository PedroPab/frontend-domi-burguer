"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { GoogleIcon } from "../ui/icons";
import { Separator } from "../ui/separator";

// Firebase Auth (SDK modular)
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  type ConfirmationResult,
} from "firebase/auth";

/** Si usas TypeScript, ayuda para el objeto window */
declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: ConfirmationResult;
    grecaptcha?: any;
  }
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogInModal = ({ isOpen, onClose }: ModalProps) => {
  const auth = getAuth(); // Asegúrate de tener inicializado Firebase App antes en tu proyecto
  auth.languageCode = "es"; // o: auth.useDeviceLanguage();

  // UI state
  const [phone, setPhone] = useState(""); // solo el número local sin +57
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"phone" | "code">("phone");
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Temporizador 15:00 para reCAPTCHA/SMS
  const [timeLeft, setTimeLeft] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Manejo del historial para cerrar con back (tu lógica original)
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ modalOpen: true }, "");
      window.addEventListener("popstate", handlePopState);
    }

    return () => {
      window.removeEventListener("popstate", handlePopState);
      if (!isOpen && window.history.state?.modalOpen) {
        window.history.back();
      }
    };
  }, [isOpen, onClose]);

  // Limpieza de recursos al cerrar
  useEffect(() => {
    if (!isOpen) {
      // limpiar estados
      setPhone("");
      setCode("");
      setStep("phone");
      setError(null);
      setTimeLeft(0);
      if (timerRef.current) clearInterval(timerRef.current);

      // limpiar reCAPTCHA / confirmation
      if (window.recaptchaVerifier) {
        // No hay API pública para "destroy", así que solo soltar ref
        window.recaptchaVerifier = undefined;
      }
      window.confirmationResult = undefined;
    }
  }, [isOpen]);

  // Cuenta regresiva (15 minutos) cuando se envía el SMS
  useEffect(() => {
    if (step === "code") {
      setTimeLeft(15 * 60); // 15:00
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
    const m = Math.floor(total / 60)
      .toString()
      .padStart(2, "0");
    const s = (total % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Inicializa (perezosamente) reCAPTCHA invisible y envía SMS
  const handleSendCode = async () => {
    try {
      setError(null);
      setSending(true);

      // Normaliza teléfono a E.164 con prefijo Colombia +57
      const normalized = "+57" + phone.replace(/\D/g, "");
      if (normalized.length < 10) {
        throw new Error("Ingresa un número de teléfono válido.");
      }

      // Crea una única instancia de RecaptchaVerifier (invisible)
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(
          auth,
          "send-code-btn", // ID del botón que dispara el flujo
          {
            size: "invisible",
            callback: () => {
              // Cuando se resuelve, intentamos el envío (signInWithPhoneNumber).
            },
            "expired-callback": () => {
              setError("reCAPTCHA vencido, inténtalo de nuevo.");
            },
          }
        );
      }

      const appVerifier = window.recaptchaVerifier;

      const confirmationResult = await signInWithPhoneNumber(
        auth,
        normalized,
        appVerifier
      );

      window.confirmationResult = confirmationResult;
      setStep("code");
    } catch (err: any) {
      setError(err?.message || "No se pudo enviar el SMS.");
      // Reset del widget si es visible/invisible con grecaptcha
      try {
        if (window.recaptchaVerifier) {
          const widgetId = await window.recaptchaVerifier.render();
          window.grecaptcha?.reset(widgetId);
        }
      } catch {
        // ignorar si no existe
      }
    } finally {
      setSending(false);
    }
  };

  // Verifica el código y completa el login
  const handleVerifyCode = async () => {
    try {
      setError(null);
      setVerifying(true);

      const confirmationResult = window.confirmationResult;
      if (!confirmationResult) throw new Error("Primero envía el código por SMS.");

      const result = await confirmationResult.confirm(code);
      const user = result.user;

      // Aquí ya tienes al usuario autenticado: guarda estado global, cierra modal, etc.
      onClose();
    } catch (err: any) {
      setError(err?.message || "Código inválido o expirado.");
    } finally {
      setVerifying(false);
    }
  };

  // Reenviar código (si expira o el usuario lo pide)
  const handleResend = async () => {
    // Reintenta el envío; reCAPTCHA se re-renderiza y resetea
    await handleSendCode();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        aria-describedby="Iniciar sesión"
        onInteractOutside={(event) => {
          // evita cerrar si el click viene del contenedor de Google
          if (
            event.target instanceof HTMLElement &&
            event.target.closest(".pac-container")
          ) {
            event.preventDefault();
          }
        }}
        className="flex-col flex bg-background sm:top-105 p-4 lg:p-6 rounded-2xl lg:w-[820px] h-[600px] z-600"
      >
        <div className="flex mt-6 lg:mt-0 flex-col rounded-2xl px-[30px] lg:px-[140px] w-full justify-center gap-6 h-full bg-[#F7F7F7]">
          <DialogTitle className=" font-bold text-[20px]! md:text-[24px]! leading-[22px]! md:leading-[26px]! text-neutral-black-80;">
            INICIA SESIÓN
          </DialogTitle>

          <p className="body-font">
            {step === "phone"
              ? "Ingresa tu número de celular para enviarte un código por SMS."
              : "¡Te enviamos un código de verificación! Escríbelo para continuar."}
          </p>

          {!!error && (
            <div className="text-red-600 text-sm -mt-2">{error}</div>
          )}

          <div className="flex flex-col gap-4">
            {/* Teléfono */}
            <div className={`w-full pl-6 pr-0 py-0 flex h-12 items-center justify-center relative rounded-[30px] border-[1.5px] border-solid border-[#cccccc] ${step === "code" ? "opacity-60 pointer-events-none" : ""}`}>
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
              <p style={{ fontFamily: "Montserrat, Helvetica" }} className="body-font">
                Código válido por
              </p>
              <span className=" body-font font-bold">
                {step === "code" ? formatMMSS(timeLeft) : "15:00"}
              </span>
            </div>

            {/* Botón ENVIAR CÓDIGO (móvil -> SMS) */}
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

            {/* Botón VERIFICAR (ingreso de código) */}
            {step === "code" && (
              <Button
                onClick={handleVerifyCode}
                disabled={verifying || code.length < 6}
                className="text-white rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
              >
                {verifying ? "Verificando..." : "VERIFICAR"}
              </Button>
            )}

            {/* Reenviar si expira */}
            {step === "code" && (
              <button
                type="button"
                onClick={handleResend}
                disabled={sending}
                className="text-sm underline self-center text-neutral-600"
              >
                ¿No recibiste el código? Reenviar
              </button>
            )}

            {/* Divider / Google */}
            <div className="flex items-center gap-5 mb-2">
              <Separator className="h-[2.2px] flex-1 grow" />
              <span className="body-font text-neutral-black-50!">O ingresa con</span>
              <Separator className="h-[2.2px] flex-1 grow" />
            </div>

            <Button
              variant={"outline"}
              className="text-white 20 rounded-[30px] mb-2 flex items-center gap-2 text-[16px] w-full h-[48px]"
            >
              <GoogleIcon />
            </Button>
          </div>

          {/* Contenedor opcional (si quisieras widget visible) */}
          <div id="recaptcha-container" className="hidden" />
        </div>
      </DialogContent>
    </Dialog>
  );
};
