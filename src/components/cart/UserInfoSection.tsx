import React from "react";
import { User } from "firebase/auth";
import { Input } from "@/components/ui/input";
import { PhoneNumberInput } from "@/components/ui/inputPhone";

interface UserInfoSectionProps {
    user: User | null;
    formData: {
        name: string;
        phone: string;
        comment: string;
    };
    handleChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => void;
    handlePhoneChange: (value: string | undefined) => void;
}

export function UserInfoSection({
    user,
    formData,
    handleChange,
    handlePhoneChange,
}: UserInfoSectionProps) {
    return (
        <div className="flex flex-col gap-4 w-full">
            <h5 className="body-font font-bold">Tus datos</h5>

            {user && (
                <div className="p-4 mb-2 bg-green-50 border border-green-200 rounded-lg text-green-800">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">Usuario autenticado:</span>
                        {user.displayName || user.email}
                    </div>
                    <p className="text-sm">Tus datos se han autocompletado</p>
                </div>
            )}

            <div className="inline-flex flex-col gap-2 items-start w-full">
                <Input
                    id="name"
                    name="name"
                    maxLength={70}
                    placeholder="Nombres y Apellidos"
                    onChange={handleChange}
                    value={formData.name}
                    disabled={!!(user && user.displayName)}
                />

                <div className="flex flex-col lg:flex-row w-full gap-2">
                    <PhoneNumberInput
                        className="pl-2 w-full"
                        id="phone"
                        name="phone"
                        maxLength={20}
                        placeholder="Escribe tu número de teléfono"
                        onChange={handlePhoneChange}
                        value={formData.phone}
                        disabled={!!(user && user.phoneNumber)}
                    />
                </div>

                <div className="relative w-full">
                    <textarea
                        id="comment"
                        name="comment"
                        onChange={handleChange}
                        value={formData.comment}
                        maxLength={200}
                        placeholder="Algún comentario?"
                        className="w-full h-[100px] shadow-sm px-5 py-4 rounded-2xl border-[1.5px] border-[#cccccc] resize-none outline-none text-base font-normal text-neutrosblack-80 leading-[18px] tracking-[0] focus:border-[#808080]"
                    />
                    <span className="absolute bottom-3 right-3 text-gray-400 text-sm pointer-events-none">
                        {formData.comment.length}/200
                    </span>
                </div>
            </div>
        </div>
    );
}