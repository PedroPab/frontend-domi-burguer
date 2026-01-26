"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { PhoneVerificationModal } from "@/components/phone/PhoneVerificationModal";
import { Loader2 } from "lucide-react";

function VerifyPhoneContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get("redirect") || "/cart";

    const { user, loading } = useAuth();
    const [modalOpen, setModalOpen] = useState(true);

    // Redirigir si no está autenticado
    useEffect(() => {
        if (!loading && !user) {
            router.push(`/login?redirect=/verify-phone?redirect=${encodeURIComponent(redirectTo)}`);
        }
    }, [user, loading, router, redirectTo]);

    // Si ya tiene teléfono verificado, redirigir
    useEffect(() => {
        if (!loading && user?.phoneNumber) {
            router.push(redirectTo);
        }
    }, [user, loading, router, redirectTo]);

    const handleSuccess = () => {
        router.push(redirectTo);
    };

    const handleOpenChange = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            router.back();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary-red" size={70} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <PhoneVerificationModal
                open={modalOpen}
                onOpenChange={handleOpenChange}
                mode="link"
                onSuccess={handleSuccess}
            />
        </div>
    );
}

export default function VerifyPhonePage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-primary-red" size={70} />
            </div>
        }>
            <VerifyPhoneContent />
        </Suspense>
    );
}
