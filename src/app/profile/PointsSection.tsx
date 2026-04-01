"use client";

import { Loader2, Star, ChevronRight } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

export function PointsSection() {
    const { userProfile, loading } = useUserProfile();

    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                MIS PUNTOS
            </h2>
            <div className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Star className="w-5 h-5 text-neutral-500" />
                        <div>
                            <p className="font-medium text-neutral-800">
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5 text-neutral-400" />
                                ) : (
                                    <>{userProfile?.pointsBalance ?? 0} puntos</>
                                )}
                            </p>
                            <p className="text-xs text-neutral-500">
                                Pronto podrás canjear tus puntos por premios
                            </p>
                        </div>
                    </div>
                    <button
                        disabled
                        className="flex items-center gap-1 opacity-50 cursor-not-allowed"
                    >
                        <span className="text-xs text-neutral-400">Próximamente</span>
                        <ChevronRight className="w-5 h-5 text-neutral-400" />
                    </button>
                </div>
            </div>
        </div>
    );
}
