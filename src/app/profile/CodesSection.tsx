"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Code } from "@/types/codes";
import { CodesService } from "@/services/codesService";
import { getIdToken } from "firebase/auth";
import { Loader2, Gift, Share2, Check, Hash, ChevronRight } from "lucide-react";
import { UserCodeModal } from "@/app/codes/UserCodeModal";
import { addToast } from "@heroui/toast";
import Link from "next/link";

export function CodesSection() {
    const { user } = useAuth();
    const [codes, setCodes] = useState<Code[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const fetchCodes = async () => {
        if (!user) return;
        setIsLoading(true);
        try {
            const token = await getIdToken(user);
            const response = await CodesService.getCodesByUser(token, user.uid);
            setCodes(response.body);
        } catch (err) {
            console.error("Error cargando códigos", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchCodes();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const referralCode = codes.find((code) => code.type === "referral");

    const copyToClipboard = async (text: string) => {
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(text);
                return true;
            }
            const textArea = document.createElement("textarea");
            textArea.value = text;
            textArea.style.position = "fixed";
            textArea.style.left = "-999999px";
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand("copy");
            document.body.removeChild(textArea);
            return true;
        } catch {
            return false;
        }
    };

    const handleShare = async () => {
        if (!referralCode) return;

        const referralUrl = `${window.location.origin}/referral/${referralCode.code}`;
        const shareData = {
            title: "Código de referido Domi Burguer",
            text: `¡Usa mi código ${referralCode.code} en tu primer pedido en Domi Burguer!`,
            url: referralUrl,
        };

        const canShare =
            typeof navigator.share === "function" &&
            typeof navigator.canShare === "function" &&
            navigator.canShare(shareData);

        if (canShare) {
            try {
                await navigator.share(shareData);
                return;
            } catch (err) {
                if ((err as Error).name === "AbortError") return;
            }
        }

        const success = await copyToClipboard(referralUrl);
        if (success) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            addToast({
                title: "Enlace copiado",
                description: "El enlace de tu código de referido ha sido copiado",
                variant: "solid",
                color: "success",
            });
        }
    };

    return (
        <>
            <div className="mb-8">
                <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                    MIS CÓDIGOS
                </h2>

                {isLoading ? (
                    <div className="flex justify-center py-6">
                        <Loader2 className="animate-spin text-primary-red" size={32} />
                    </div>
                ) : referralCode ? (
                    <div className="border border-gray-200 rounded-xl overflow-hidden">
                        <Link
                            href={`/referral/${referralCode.code}`}
                            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                        >
                            <div className="flex items-center gap-4">
                                <Gift className="w-5 h-5 text-neutral-500" />
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-bold text-neutral-800 group-hover:text-primary-red transition-colors">
                                            {referralCode.code}
                                        </p>
                                        <span className="px-2 py-0.5 rounded text-xs bg-blue-100 text-blue-700">
                                            Referido
                                        </span>
                                    </div>
                                    <p className="text-xs text-neutral-500 flex items-center gap-1 mt-0.5">
                                        <Hash className="w-3 h-3" />
                                        {referralCode.usageCount} usos
                                    </p>
                                </div>
                            </div>
                            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-red transition-colors" />
                        </Link>
                        <div className="border-t border-gray-200">
                            <button
                                onClick={handleShare}
                                className="w-full flex items-center justify-center gap-2 p-3 text-primary-red hover:bg-red-50 transition-colors font-medium text-sm"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-4 h-4 text-green-500" />
                                        <span className="text-green-600">Enlace copiado</span>
                                    </>
                                ) : (
                                    <>
                                        <Share2 className="w-4 h-4" />
                                        COMPARTIR MI CÓDIGO
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                ) : (
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <Gift className="w-5 h-5 text-neutral-500" />
                            <div className="text-left">
                                <p className="font-medium text-neutral-800">
                                    Crear mi código de referido
                                </p>
                                <p className="text-xs text-neutral-500">
                                    Invita amigos y gana beneficios
                                </p>
                            </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-primary-red transition-colors" />
                    </button>
                )}
            </div>

            <UserCodeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchCodes}
            />
        </>
    );
}
