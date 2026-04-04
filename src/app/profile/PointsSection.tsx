"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Star, ChevronDown, ChevronRight, Plus, Minus } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useUserPoints } from "@/hooks/useUserPoints";
import { POINT_FLOW_TYPES, Point, FirebaseTimestamp } from "@/types/points";

function formatDate(timestamp: FirebaseTimestamp): string {
    const date = new Date(timestamp._seconds * 1000);
    return date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

export function PointsSection() {
    const { userProfile, loading: loadingProfile } = useUserProfile();
    const { points, loading: loadingPoints } = useUserPoints();
    const [isExpanded, setIsExpanded] = useState(false);

    const loading = loadingProfile || loadingPoints;
    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                MIS PUNTOS
            </h2>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
                {/* Sección principal de puntos */}
                <div className="p-4">
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

                {/* Botón desplegable para historial */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-t border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                    <span className="text-sm text-neutral-600">
                        {isExpanded ? "Ocultar historial" : "Ver historial de puntos"}
                    </span>
                    <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <ChevronDown className="w-4 h-4 text-neutral-500" />
                    </motion.div>
                </button>

                {/* Lista de historial con animación */}
                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                                height: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
                                opacity: { duration: 0.2, ease: "easeInOut" },
                            }}
                            className="border-t border-gray-200 overflow-hidden"
                        >
                            {points.length === 0 ? (
                                <p className="p-4 text-sm text-neutral-500 text-center">
                                    No hay registros de puntos
                                </p>
                            ) : (
                                <div className="divide-y divide-gray-100">
                                    {points.map((record: Point, index: number) => (
                                        <motion.div
                                            key={record.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                                ease: [0.4, 0, 0.2, 1],
                                            }}
                                            className="p-4 flex items-center justify-between"
                                        >
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-neutral-800 truncate">
                                                    {record.description}
                                                </p>
                                                <p className="text-xs text-neutral-500">
                                                    {formatDate(record.createdAt)}
                                                </p>
                                            </div>
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{
                                                    duration: 0.2,
                                                    delay: index * 0.05 + 0.1,
                                                }}
                                                className="flex items-center gap-1 ml-4"
                                            >
                                                {record.flowType === POINT_FLOW_TYPES.INPUT && (
                                                    <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                                                        <Plus className="w-3 h-3" />
                                                        {record.points}
                                                    </span>
                                                )}
                                                {record.flowType === POINT_FLOW_TYPES.OUTPUT && (
                                                    <span className="flex items-center gap-1 text-sm font-medium text-red-500">
                                                        <Minus className="w-3 h-3" />
                                                        {record.points}
                                                    </span>
                                                )}
                                            </motion.div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
