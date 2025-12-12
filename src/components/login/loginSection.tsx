"use client";

import React, { useEffect } from "react";
import { Separator } from "../ui/separator";
import { auth } from "@/lib/firebase";
import { PhoneLogin } from "./phoneLogin";
import { GoogleLogin } from "./googleLogin";
import { useAuth } from "@/contexts/AuthContext";

interface LoginSectionProps {
    onClose: () => void;
    redirectTo?: string;
}

/**
 * Componente principal de inicio de sesión
 */
export const LoginSection = ({ onClose, redirectTo = "/profile" }: LoginSectionProps) => {
    // Utilizamos useAuth pero no necesitamos el error aquí ya que se maneja en los componentes hijos
    useAuth();

    // Configurar el idioma de Firebase Auth
    useEffect(() => {
        auth.languageCode = "es";
    }, []);

    return (
        <div className="flex mt-6 lg:mt-0 flex-col rounded-2xl px-[30px] lg:px-[140px] w-full justify-center gap-6 h-full bg-[#F7F7F7]">
            <h2 className="font-bold text-[20px]! md:text-[24px]! leading-[22px]! md:leading-[26px]! text-neutral-black-80">
                INICIA SESIÓN
            </h2>

            <p className="body-font">
                Ingresa tu número de celular para enviarte un código por SMS.
            </p>

            {/* Componente de inicio de sesión con teléfono */}
            <PhoneLogin onClose={onClose} redirectTo={redirectTo} />

            {/* Separador y botón de Google */}
            <div className="flex items-center gap-5 mb-2">
                <Separator className="h-[2.2px] flex-1 grow" />
                <span className="body-font text-neutral-black-50!">O ingresa con</span>
                <Separator className="h-[2.2px] flex-1 grow" />
            </div>

            {/* Componente de inicio de sesión con Google */}
            <GoogleLogin
                onClose={onClose}
                redirectTo={redirectTo}
                className="mb-2"
            />
        </div>
    );
};