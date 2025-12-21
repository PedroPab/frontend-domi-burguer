import React from "react";
import { FormHeader } from "./FormHeader";
import { UserInfoSection } from "./UserInfoSection";
import { AddressSection } from "./AddressSection";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { useAuth } from "@/contexts/AuthContext";
import useFormCart from "@/hooks/cart/useFormcart";

export function CheckoutForm() {
    const { user } = useAuth();

    const {
        formData,
        handleChange,
        handlePhoneChange: setPhoneValue,
        paymentMethods,
        error,
    } = useFormCart();

    return (
        <div className="flex flex-col gap-14 pb-6 w-full lg:mt-4 max-w-[500px]">
            <div className="flex flex-col gap-6 w-full">
                <FormHeader error={error} />

                <UserInfoSection
                    user={user}
                    formData={formData}
                    handleChange={handleChange}
                    handlePhoneChange={(e) => setPhoneValue(e.target.value)}
                />

                <AddressSection />

                <PaymentMethodsSection
                    paymentMethods={paymentMethods}
                    selectedMethod={formData.paymentMethod}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}