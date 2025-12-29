"use client";

import React, { useEffect } from "react";
import { auth } from "@/lib/firebase";
import { GoogleLogin } from "./googleLogin";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent } from "@/components/ui/card";

interface LoginSectionProps {
    onClose: () => void;
    redirectTo?: string;
}

export const LoginSection = ({ onClose, redirectTo = "/profile" }: LoginSectionProps) => {
    useAuth();

    useEffect(() => {
        auth.languageCode = "es";
    }, []);

    return (
        <div className="flex flex-col w-full h-full justify-center items-center px-5 md:px-0">
            <Card className="w-full max-w-[500px] bg-accent-yellow-10 rounded-[30px] shadow-none border-0">
                <CardContent className="flex flex-col gap-6 p-6 md:p-10">
                    <div className="flex flex-col gap-2 items-center text-center">
                        <h2 className="font-bold text-[20px] md:text-[24px] leading-[22px] md:leading-[26px] text-neutral-black-80">
                            Inicia sesión
                        </h2>
                        <p className="body-font text-neutral-black-50">
                            Ingresa con tu cuenta de Google para continuar.
                        </p>
                    </div>

                    <div className="flex flex-col gap-4 w-full">
                        <GoogleLogin
                            onClose={onClose}
                            redirectTo={redirectTo}
                            variant="outline"
                        />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};