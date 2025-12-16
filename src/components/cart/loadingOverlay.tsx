import React from "react";
import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
    isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
    if (!isLoading) return null;

    return (
        <div className="absolute inset-0 z-500 bg-black/40 flex items-center justify-center">
            <Loader2 className="animate-spin text-primary-red" size={70} />
        </div>
    );
}