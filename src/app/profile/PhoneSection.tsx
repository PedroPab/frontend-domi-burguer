"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { Phone, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const PhoneVerificationModal = dynamic(
    () =>
        import("@/components/phone/PhoneVerificationModal").then(
            (mod) => mod.PhoneVerificationModal
        ),
    { ssr: false }
);

export function PhoneSection() {
    const { user, reloadUser } = useAuth();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMode, setModalMode] = useState<"link" | "change">("link");

    const handleOpenModal = (mode: "link" | "change") => {
        setModalMode(mode);
        setModalOpen(true);
    };

    const handlePhoneVerified = async () => {
        await reloadUser();
    };

    if (!user) return null;

    return (
        <>
            <div className="mb-8">
                <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                    MI TELÉFONO
                </h2>
                <button
                    onClick={() => handleOpenModal(user.phoneNumber ? "change" : "link")}
                    className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
                >
                    <div className="flex items-center gap-4">
                        <Phone className="w-5 h-5 text-neutral-500" />
                        <div className="text-left">
                            {user.phoneNumber ? (
                                <>
                                    <p className="font-medium text-neutral-800">
                                        {user.phoneNumber}
                                    </p>
                                    <p className="text-xs text-green-600">Verificado</p>
                                </>
                            ) : (
                                <>
                                    <p className="font-medium text-neutral-500">
                                        Agregar número de teléfono
                                    </p>
                                    <p className="text-xs text-primary-red">Toca para verificar</p>
                                </>
                            )}
                        </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-neutral-400" />
                </button>
            </div>

            <PhoneVerificationModal
                open={modalOpen}
                onOpenChange={setModalOpen}
                mode={modalMode}
                onSuccess={handlePhoneVerified}
            />
        </>
    );
}
