"use client";

import { useState } from "react";
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { useAuth } from "@/contexts/AuthContext";
import useFormCart from "@/hooks/cart/useFormcart";
import { PhoneVerificationModal } from "@/components/phone/PhoneVerificationModal";
import { Button } from "@/components/ui/button";
import { Phone, CheckCircle } from "lucide-react";

const InputPhone = () => {
    const { user, reloadUser } = useAuth();
    const [phoneModalOpen, setPhoneModalOpen] = useState(false);

    const {
        formData,
        handlePhoneChange,
    } = useFormCart();

    const handlePhoneVerified = async () => {
        await reloadUser();
    };

    // Usuario autenticado con teléfono verificado
    if (user?.phoneNumber) {
        return (
            <>
                {/* <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div className="flex-1">
                        <p className="text-sm text-green-700 font-medium">Teléfono verificado</p>
                        <p className="text-sm text-green-600">{user.phoneNumber}</p>
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setPhoneModalOpen(true)}
                        className="text-green-700 hover:text-green-800 hover:bg-green-100"
                    >
                        Cambiar
                    </Button>
                    <PhoneVerificationModal
                        open={phoneModalOpen}
                        onOpenChange={setPhoneModalOpen}
                        mode="change"
                        onSuccess={handlePhoneVerified}
                    />
                </div> */}
            </>

        );
    }

    // Usuario autenticado sin teléfono verificado
    if (user && !user.phoneNumber) {
        return (
            <>
                <button
                    type="button"

                    onClick={() => setPhoneModalOpen(true)}
                    className="w-full flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-200 hover:bg-amber-100 transition-colors"
                >
                    <Phone className="w-5 h-5 text-amber-600" />
                    <div className="flex-1 text-left">
                        <p className="text-sm text-amber-700 font-medium">Verifica tu número de teléfono</p>
                        <p className="text-xs text-amber-600">Requerido para completar tu pedido</p>
                    </div>
                </button>
                <PhoneVerificationModal
                    open={phoneModalOpen}
                    onOpenChange={setPhoneModalOpen}
                    mode="link"
                    onSuccess={handlePhoneVerified}
                />
            </>
        );
    }

    // Usuario no autenticado - mostrar input manual
    return (
        <div className="flex flex-col lg:flex-row w-full gap-2">
            <PhoneNumberInput
                className="pl-2 w-full"
                id="phone"
                name="phone"
                maxLength={20}
                placeholder="Escribe tu número de teléfono"
                onChange={handlePhoneChange}
                value={formData.phone}
            />
        </div>
    );
};

export default InputPhone;