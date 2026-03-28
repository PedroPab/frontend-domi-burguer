"use client";

import { useState } from "react";
import { Code } from "@/types/codes";
import { Pencil, Trash2, Hash } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { ConfirmModal } from "@/components/ui/modal/presets/ConfirmModal";

interface CodeCardProps {
    code: Code;
    onDelete: (codeId: string) => void;
    onToggleStatus: (code: Code) => void;
}

const codeTypeLabels: Record<string, string> = {
    referral: "Referido",
    promotional: "Promocional",
    loyalty: "Fidelidad",
};

export function CodeCard({ code, onDelete, onToggleStatus }: CodeCardProps) {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const isExpired = code.expirationDate && new Date(code.expirationDate) < new Date();

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await onDelete(code.id);
        } finally {
            setIsDeleting(false);
            setShowDeleteModal(false);
        }
    };

    return (
        <>
            <ConfirmModal
                open={showDeleteModal}
                onOpenChange={setShowDeleteModal}
                title="Eliminar código"
                message={`¿Estás seguro de que deseas eliminar el código "${code.code}"?`}
                onConfirm={handleDelete}
                confirmText="ELIMINAR"
                cancelText="CANCELAR"
                destructive
                loading={isDeleting}
            />
            <div className="flex items-start justify-between py-4 gap-4 border-b border-gray-200 last:border-b-0">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-neutral-800 text-base">
                            {code.code}
                        </h3>
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
                    {code.description && (
                        <p className="text-sm text-neutral-600 mt-1">{code.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
                        <span className="flex items-center gap-1">
                            <Hash className="w-3 h-3" />
                            Usos: {code.usageCount}{code.usageLimit ? ` / ${code.usageLimit}` : ""}
                        </span>
                        {isExpired && (
                            <span className="text-red-500">Expirado</span>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Switch
                        checked={code.status === "active"}
                        onCheckedChange={() => onToggleStatus(code)}
                        disabled
                    />
                    <button
                        disabled
                        className="p-2 text-neutral-300 cursor-not-allowed"
                        aria-label="Editar código"
                    >
                        <Pencil className="w-5 h-5" />
                    </button>
                    <button
                        disabled
                        className="p-2 text-neutral-300 cursor-not-allowed"
                        aria-label="Eliminar código"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );
}
