import React from "react";
import { User } from "firebase/auth";
import { FormHeader } from "./FormHeader";
import { UserInfoSection } from "./UserInfoSection";
import { AddressSection } from "./AddressSection";
import { PaymentMethodsSection } from "./PaymentMethodsSection";
import { Address } from "@/types/address";
import { LucideIcon } from "lucide-react";

interface PaymentMethod {
    id: string;
    label: string;
    icon: LucideIcon;
    iconClass: string;
}

interface CheckoutFormProps {
    user: User | null;
    error?: string;

    // Form Data
    formData: {
        name: string;
        phone: string;
        comment: string;
        paymentMethod: string;
    };

    // Handlers
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    // Address
    addressStore: Address;
    onOpenAddressModal: () => void;
    onEditAddress: () => void;
    onRemoveAddress: () => void;

    // Payment Methods
    paymentMethods: PaymentMethod[];
}

export function CheckoutForm({
    user,
    error,
    formData,
    handleChange,
    handlePhoneChange,
    addressStore,
    onOpenAddressModal,
    onEditAddress,
    onRemoveAddress,
    paymentMethods,
}: CheckoutFormProps) {
    return (
        <div className="flex flex-col gap-14 pb-6 w-full lg:mt-4 max-w-[500px]">
            <div className="flex flex-col gap-6 w-full">
                <FormHeader error={error} />

                <UserInfoSection
                    user={user}
                    formData={formData}
                    handleChange={handleChange}
                    handlePhoneChange={handlePhoneChange}
                />

                <AddressSection
                    user={user}
                    addressClient={addressStore}
                    onOpenModal={onOpenAddressModal}
                    onEditAddress={onEditAddress}
                    onRemoveAddress={onRemoveAddress}
                />

                <PaymentMethodsSection
                    paymentMethods={paymentMethods}
                    selectedMethod={formData.paymentMethod}
                    onChange={handleChange}
                />
            </div>
        </div>
    );
}