import React from "react";
import { FormHeader } from "./FormHeader";
import { UserInfoSection } from "./UserInfoSection";
import { AddressSection } from "./AddressSection";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import useFormCart from "@/hooks/cart/useFormcart";

export function CheckoutForm() {

    const {
        formData,
        handleChange,
        handlePhoneChange,
        paymentMethods,
        error,
    } = useFormCart();

    console.log("Rendering CheckoutForm with formData:", formData);

    return (
        <div className="flex flex-col gap-14 pb-6 w-full lg:mt-4 max-w-[500px]">
            <div className="flex flex-col gap-6 w-full">
                <FormHeader error={error} />

                <UserInfoSection
                    formData={formData}
                    handleChange={handleChange}
                    handlePhoneChange={handlePhoneChange}
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