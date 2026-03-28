"use client";

import { useState, useEffect } from "react";
import { Code, CodeType, CodeStatus, RewardType, RewardAddType } from "@/types/codes";
import { useAuth } from "@/contexts/AuthContext";
import { getIdToken } from "firebase/auth";
import { CodesService } from "@/services/codesService";
import { X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface CodeModalProps {
    isOpen: boolean;
    onClose: () => void;
    codeToEdit: Code | null;
}

interface FormData {
    code: string;
    type: CodeType;
    description: string;
    usageLimit: string;
    expirationDate: string;
    status: CodeStatus;
    rewardType: RewardType | "";
    rewardAddType: RewardAddType;
}

const initialFormData: FormData = {
    code: "",
    type: "referral",
    description: "",
    usageLimit: "",
    expirationDate: "",
    status: "active",
    rewardType: "",
    rewardAddType: "product",
};

export function CodeModal({ isOpen, onClose, codeToEdit }: CodeModalProps) {
    const { user } = useAuth();
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (codeToEdit) {
            setFormData({
                code: codeToEdit.code,
                type: codeToEdit.type,
                description: codeToEdit.description || "",
                usageLimit: codeToEdit.usageLimit?.toString() || "",
                expirationDate: codeToEdit.expirationDate
                    ? new Date(codeToEdit.expirationDate).toISOString().split("T")[0]
                    : "",
                status: codeToEdit.status,
                rewardType: codeToEdit.reward?.type || "",
                rewardAddType: codeToEdit.reward?.typeAddReward || "product",
            });
        } else {
            setFormData(initialFormData);
        }
        setError(null);
    }, [codeToEdit, isOpen]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (name: keyof FormData, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const token = await getIdToken(user);

            const codeData: Partial<Code> = {
                code: formData.code.toUpperCase(),
                type: formData.type,
                description: formData.description || undefined,
                usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
                expirationDate: formData.expirationDate
                    ? new Date(formData.expirationDate)
                    : null,
                status: formData.status,
                reward: formData.rewardType
                    ? {
                        type: formData.rewardType as RewardType,
                        typeAddReward: formData.rewardAddType,
                        elements: [],
                    }
                    : null,
            };

            if (codeToEdit) {
                await CodesService.updateCode(token, codeToEdit.id, codeData);
            } else {
                await CodesService.createCode(token, codeData);
            }

            onClose();
        } catch (err) {
            console.error("Error guardando código:", err);
            setError("No se pudo guardar el código. Intenta de nuevo.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent
                onOpenChange={(open) => !open && onClose()}
                className="sm:max-w-lg"
            >
                <DialogHeader className="px-6 pt-0">
                    <div className="flex items-center justify-between">
                        <DialogTitle className="text-lg font-bold uppercase">
                            {codeToEdit ? "Editar Código" : "Crear Código"}
                        </DialogTitle>
                        <button
                            onClick={onClose}
                            className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                        >
                            <X className="w-5 h-5 text-neutral-500" />
                        </button>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="px-6 pb-4 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Código *
                        </label>
                        <Input
                            name="code"
                            value={formData.code}
                            onChange={handleInputChange}
                            placeholder="Ej: PROMO2024"
                            required
                            className="uppercase"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Tipo de código *
                        </label>
                        <Select
                            value={formData.type}
                            onValueChange={(value) => handleSelectChange("type", value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="promotional">Promocional</SelectItem>
                                <SelectItem value="referral">Referido</SelectItem>
                                <SelectItem value="loyalty">Fidelidad</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Descripción
                        </label>
                        <Input
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Descripción del código..."
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Límite de usos
                            </label>
                            <Input
                                name="usageLimit"
                                type="number"
                                min="1"
                                value={formData.usageLimit}
                                onChange={handleInputChange}
                                placeholder="Sin límite"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Fecha de expiración
                            </label>
                            <Input
                                name="expirationDate"
                                type="date"
                                value={formData.expirationDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Tipo de recompensa
                        </label>
                        <Select
                            value={formData.rewardType}
                            onValueChange={(value) =>
                                handleSelectChange("rewardType", value)
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Sin recompensa" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="discount">Descuento</SelectItem>
                                <SelectItem value="freeProduct">Producto gratis</SelectItem>
                                <SelectItem value="fixedPriceInElement">
                                    Precio fijo en elemento
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {formData.rewardType && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">
                                Aplicar a
                            </label>
                            <Select
                                value={formData.rewardAddType}
                                onValueChange={(value) =>
                                    handleSelectChange("rewardAddType", value)
                                }
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="product">Producto</SelectItem>
                                    <SelectItem value="complement">Complemento</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            Estado
                        </label>
                        <Select
                            value={formData.status}
                            onValueChange={(value) => handleSelectChange("status", value)}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Activo</SelectItem>
                                <SelectItem value="inactive">Inactivo</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !formData.code}
                            className="w-full rounded-full h-12"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                    Guardando...
                                </>
                            ) : codeToEdit ? (
                                "ACTUALIZAR CÓDIGO"
                            ) : (
                                "CREAR CÓDIGO"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
