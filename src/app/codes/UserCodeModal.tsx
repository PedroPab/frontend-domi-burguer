"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getIdToken } from "firebase/auth";
import { CodesService } from "@/services/codesService";
import { X, Loader2, AlertTriangle, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface UserCodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const MAX_CODE_LENGTH = 12;

export function UserCodeModal({ isOpen, onClose, onSuccess }: UserCodeModalProps) {
    const { user } = useAuth();
    const [code, setCode] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
        if (value.length <= MAX_CODE_LENGTH) {
            setCode(value);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user || !code.trim()) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = await getIdToken(user);
            await CodesService.createCodeByUser(token, code);
            onSuccess?.();
            onClose();
        } catch (err) {
            console.error("Error creando código:", err);
            setError("No se pudo crear el código. Es posible que ya tengas uno asignado o el código ya existe.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setCode("");
        setError(null);
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent
                onOpenChange={(open) => !open && handleClose()}
                className="sm:max-w-md"
            >
                <DialogHeader className="px-6 pt-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold uppercase flex items-center gap-2">
                            <Gift className="w-5 h-5 text-primary-red" />
                            Crear Mi Código
                        </DialogTitle>
                        <button
                            onClick={handleClose}
                            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                    </div>
                </DialogHeader>

                <div className="px-6 pb-6">
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                <p className="font-semibold mb-2">Importante: Lee antes de continuar</p>
                                <ul className="space-y-1 list-disc list-inside text-amber-700">
                                    <li>Solo puedes crear <strong>un único código</strong> de referido.</li>
                                    <li>Una vez creado, <strong>no podrás cambiarlo</strong>.</li>
                                    <li>Elige un código que sea fácil de recordar y compartir.</li>
                                    <li>Máximo {MAX_CODE_LENGTH} caracteres (letras y números).</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {error && (
                            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-2">
                                Tu código personalizado
                            </label>
                            <Input
                                value={code}
                                onChange={handleCodeChange}
                                placeholder="Ej: MICODIGO123"
                                className="text-center text-lg font-semibold tracking-wider uppercase"
                                maxLength={MAX_CODE_LENGTH}
                            />
                            <p className="mt-1 text-xs text-neutral-500 text-right">
                                {code.length} / {MAX_CODE_LENGTH} caracteres
                            </p>
                        </div>

                        <div className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
                            <p>
                                Comparte este código con tus amigos y familiares. Cuando lo usen
                                en su primer pedido, ambos recibirán beneficios especiales.
                            </p>
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting || code.length < 3}
                            className="w-full rounded-full h-12"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Creando código...
                                </>
                            ) : (
                                "CREAR MI CÓDIGO"
                            )}
                        </Button>

                        <p className="text-xs text-center text-neutral-400">
                            Al crear tu código, aceptas los términos y condiciones del programa de referidos.
                        </p>
                    </form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
