"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CodesService } from "@/services/codesService";
import { Code } from "@/types/codes";
import { Loader2, Gift, Copy, Check, ShoppingBag, ArrowRight, QrCode } from "lucide-react";
import Image from "next/image";
import { QRShare } from "@/components/QRShare";

export default function ReferralPage() {
    const params = useParams();
    const router = useRouter();
    const codeParam = params.code as string;

    const [code, setCode] = useState<Code | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [currentUrl, setCurrentUrl] = useState("");

    useEffect(() => {
        setCurrentUrl(window.location.href);
    }, []);

    useEffect(() => {
        const fetchCode = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await CodesService.getCodeByIdPublic(codeParam);
                setCode(response.body);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Código no encontrado";
                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (codeParam) {
            fetchCode();
        }
    }, [codeParam]);

    const handleCopyCode = async () => {
        if (code) {
            await navigator.clipboard.writeText(code.code);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleGoToMenu = () => {
        router.push("/");
    };

    if (loading) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin h-10 w-10 mx-auto mb-4 text-primary-red" />
                    <p className="text-gray-600">Cargando código de referido...</p>
                </div>
            </div>
        );
    }

    if (error || !code) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center px-4">
                <Card className="w-full max-w-md p-8 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                        <Gift className="w-8 h-8 text-red-500" />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-800">Código no encontrado</h1>
                    <p className="text-gray-600 mb-6">
                        {error || "El código de referido que buscas no existe o ha expirado."}
                    </p>
                    <Button onClick={handleGoToMenu} className="w-full bg-primary-red hover:bg-red-600">
                        Ir al menú
                    </Button>
                </Card>
            </div>
        );
    }

    const isExpired = code.expirationDate && new Date(code.expirationDate) < new Date();
    const isInactive = code.status !== "active";

    return (
        <div className="min-h-[80vh] py-8 px-4">
            <div className="max-w-lg mx-auto">
                {/* Logo y encabezado */}
                <div className="text-center mb-8">
                    <div className="relative w-24 h-24 mx-auto mb-4">
                        <Image
                            src="/logo.png"
                            alt="Domi Burguer"
                            fill
                            className="object-contain"
                        />
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                        ¡Te han invitado a Domi Burguer!
                    </h1>
                    <p className="text-gray-600">
                        Usa este código de referido en tu primer pedido
                    </p>
                </div>

                {/* Tarjeta del código */}
                <Card className="mb-6 overflow-hidden">
                    <div className="bg-gradient-to-r from-primary-red to-red-600 p-6 text-center">
                        <div className="inline-flex items-center gap-2 bg-white/20 rounded-full px-4 py-1 mb-4">
                            <Gift className="w-4 h-4 text-white" />
                            <span className="text-white text-sm font-medium">Código de referido</span>
                        </div>
                        <div className="bg-white rounded-xl p-4 shadow-lg">
                            <p className="text-3xl md:text-4xl font-bold text-gray-800 tracking-wider">
                                {code.code}
                            </p>
                        </div>
                    </div>
                    <CardContent className="p-6">
                        {(isExpired || isInactive) && (
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4 text-center">
                                <p className="text-yellow-800 text-sm font-medium">
                                    {isExpired ? "Este código ha expirado" : "Este código no está activo actualmente"}
                                </p>
                            </div>
                        )}

                        <Button
                            onClick={handleCopyCode}
                            variant="outline"
                            className="w-full mb-4 flex items-center justify-center gap-2"
                            disabled={isExpired || isInactive}
                        >
                            {copied ? (
                                <>
                                    <Check className="w-5 h-5 text-green-500" />
                                    <span>¡Copiado!</span>
                                </>
                            ) : (
                                <>
                                    <Copy className="w-5 h-5" />
                                    <span>Copiar código</span>
                                </>
                            )}
                        </Button>

                        {code.description && (
                            <p className="text-center text-gray-600 text-sm">
                                {code.description}
                            </p>
                        )}
                    </CardContent>
                </Card>

                {/* Instrucciones de uso */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                            <ShoppingBag className="w-5 h-5 text-primary-red" />
                            ¿Cómo usar tu código?
                        </h2>
                        <ol className="space-y-4">
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-primary-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    1
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Explora nuestro menú</p>
                                    <p className="text-gray-600 text-sm">Elige tus hamburguesas favoritas y agrégalas al carrito.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-primary-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    2
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Ve al carrito</p>
                                    <p className="text-gray-600 text-sm">Revisa tu pedido y busca la opción de aplicar código.</p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-primary-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    3
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">Ingresa el código</p>
                                    <p className="text-gray-600 text-sm">
                                        Escribe <span className="font-bold text-primary-red">{code.code}</span> y aplícalo para obtener tu beneficio.
                                    </p>
                                </div>
                            </li>
                            <li className="flex gap-3">
                                <span className="flex-shrink-0 w-7 h-7 bg-primary-red text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    4
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800">¡Disfruta!</p>
                                    <p className="text-gray-600 text-sm">Completa tu pedido y disfruta de tus deliciosas hamburguesas.</p>
                                </div>
                            </li>
                        </ol>
                    </CardContent>
                </Card>

                {/* Código QR para compartir */}
                <Card className="mb-6">
                    <CardContent className="p-6">
                        <h2 className="font-bold text-lg text-gray-800 mb-4 flex items-center justify-center gap-2">
                            <QrCode className="w-5 h-5 text-primary-red" />
                            Comparte con QR
                        </h2>
                        {currentUrl && (
                            <QRShare
                                url={currentUrl}
                                title="Escanea para usar el código de referido"
                                fileName={`referido-${code.code}`}
                            />
                        )}
                    </CardContent>
                </Card>

                {/* Botón de acción */}
                <Button
                    onClick={handleGoToMenu}
                    className="w-full bg-primary-red hover:bg-red-600 text-lg py-6 flex items-center justify-center gap-2"
                    disabled={isExpired || isInactive}
                >
                    <span>Ver el menú</span>
                    <ArrowRight className="w-5 h-5" />
                </Button>

                {/* Footer */}
                <p className="text-center text-gray-500 text-sm mt-6">
                    ¿Tienes preguntas? Contáctanos por WhatsApp
                </p>
            </div>
        </div>
    );
}
