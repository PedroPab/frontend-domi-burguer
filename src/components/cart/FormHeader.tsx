import React from "react";

interface FormHeaderProps {
    error?: string;
}

export function FormHeader({ error }: FormHeaderProps) {
    return (
        <div className="inline-flex gap-4 flex-col">
            <h2 className="items-start">INFORMACIÓN DE COMPRA</h2>
            <p className="body-font">
                Completa el siguiente formulario con tu información.
            </p>

            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                </div>
            )}
        </div>
    );
}