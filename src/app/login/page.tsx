"use client";

import { LoginSection } from "@/components/login/loginSection";


export default function LoginPage() {

    const onClose = () => {
        // Handle close logic
    };

    return (
        <main className="min-h-screen flex items-center justify-center">
            <LoginSection onClose={onClose} />

        </main>
    );
}
