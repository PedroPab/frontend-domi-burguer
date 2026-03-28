"use client";

import { Clock } from "lucide-react";

interface ComingSoonSectionProps {
    title: string;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ title }) => {
    return (
        <div className="mb-8">
            <h2 className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-4">
                {title}
            </h2>
            <div className="bg-gray-100 rounded-xl p-8 flex flex-col items-center justify-center">
                <Clock className="w-10 h-10 text-gray-400 mb-3" />
                <p className="text-gray-500 font-medium text-lg">Próximamente</p>
                <p className="text-gray-400 text-sm mt-1">Esta función estará disponible pronto</p>
            </div>
        </div>
    );
};
