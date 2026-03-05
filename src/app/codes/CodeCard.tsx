"use client";

import { Code } from "@/types/codes";
import { Pencil, Trash2, Tag, Users, Calendar, Hash } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface CodeCardProps {
    code: Code;
    onEdit: (code: Code) => void;
    onDelete: (codeId: string) => void;
    onToggleStatus: (code: Code) => void;
}

const codeTypeLabels: Record<string, string> = {
    referral: "Referido",
    promotional: "Promocional",
    loyalty: "Fidelidad",
};

const rewardTypeLabels: Record<string, string> = {
    fixedPriceInElement: "Precio fijo",
    discount: "Descuento",
    freeProduct: "Producto gratis",
};

export function CodeCard({ code, onEdit, onDelete, onToggleStatus }: CodeCardProps) {
    const isExpired = code.expirationDate && new Date(code.expirationDate) < new Date();
    const isActive = code.status === "active" && !isExpired;

    const formatDate = (date: Date | null | undefined) => {
        if (!date) return "Sin fecha";
        return new Date(date).toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div
            className={`rounded-xl border p-4 transition-all ${
                isActive
                    ? "border-green-200 bg-green-50/50"
                    : "border-neutral-200 bg-neutral-50/50"
            }`}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-neutral-200 text-neutral-600"
                        }`}
                    >
                        {code.code}
                    </span>
                    <span
                        className={`px-2 py-0.5 rounded text-xs ${
                            code.type === "referral"
                                ? "bg-blue-100 text-blue-700"
                                : code.type === "promotional"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-orange-100 text-orange-700"
                        }`}
                    >
                        {codeTypeLabels[code.type]}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Switch
                        checked={code.status === "active"}
                        onCheckedChange={() => onToggleStatus(code)}
                    />
                </div>
            </div>

            {code.description && (
                <p className="text-sm text-neutral-600 mb-3">{code.description}</p>
            )}

            {code.reward && (
                <div className="mb-3 p-2 bg-white rounded-lg border border-neutral-100">
                    <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-primary-red" />
                        <span className="font-medium">
                            {rewardTypeLabels[code.reward.type]}
                        </span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs text-neutral-500 mb-3">
                <div className="flex items-center gap-1">
                    <Hash className="w-3 h-3" />
                    <span>
                        Usos: {code.usageCount}
                        {code.usageLimit ? ` / ${code.usageLimit}` : ""}
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                        {isExpired ? (
                            <span className="text-red-500">Expirado</span>
                        ) : (
                            formatDate(code.expirationDate)
                        )}
                    </span>
                </div>
                {code.userId && (
                    <div className="flex items-center gap-1 col-span-2">
                        <Users className="w-3 h-3" />
                        <span>Asignado a usuario</span>
                    </div>
                )}
            </div>

            <div className="flex gap-2 pt-2 border-t border-neutral-100">
                <button
                    onClick={() => onEdit(code)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-neutral-600 hover:text-neutral-800 hover:bg-neutral-100 rounded-lg transition-colors"
                >
                    <Pencil className="w-4 h-4" />
                    Editar
                </button>
                <button
                    onClick={() => onDelete(code.id)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 text-sm text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Eliminar
                </button>
            </div>
        </div>
    );
}
