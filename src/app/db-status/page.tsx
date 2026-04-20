"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Mode = "login" | "register";

export default function DbStatusPage() {
    const router = useRouter();
    const { signIn, signUp } = useAuth();

    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (mode === "register" && password !== confirmPassword) {
            setError("Las contraseñas no coinciden.");
            return;
        }

        setLoading(true);
        try {
            if (mode === "login") {
                await signIn(email, password);
            } else {
                await signUp(email, password);
            }
            router.push("/profile");
        } catch (err: unknown) {
            const authErr = err as { message?: string };
            setError(authErr?.message ?? "Error al autenticar.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-sm space-y-6">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold tracking-tight">
                        {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        {mode === "login"
                            ? "Ingresa tus credenciales para continuar."
                            : "Crea una cuenta con correo y contraseña."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        type="email"
                        placeholder="Correo electrónico"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        autoComplete="email"
                    />

                    <Input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        autoComplete={mode === "login" ? "current-password" : "new-password"}
                    />

                    {mode === "register" && (
                        <Input
                            type="password"
                            placeholder="Confirmar contraseña"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            autoComplete="new-password"
                        />
                    )}

                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-[30px] h-[48px]"
                    >
                        {loading
                            ? "Cargando..."
                            : mode === "login"
                            ? "Entrar"
                            : "Registrarse"}
                    </Button>
                </form>

                <p className="text-sm text-center text-muted-foreground">
                    {mode === "login" ? (
                        <>
                            ¿No tienes cuenta?{" "}
                            <button
                                type="button"
                                onClick={() => { setMode("register"); setError(null); }}
                                className="underline hover:text-foreground transition-colors"
                            >
                                Crear cuenta
                            </button>
                        </>
                    ) : (
                        <>
                            ¿Ya tienes cuenta?{" "}
                            <button
                                type="button"
                                onClick={() => { setMode("login"); setError(null); }}
                                className="underline hover:text-foreground transition-colors"
                            >
                                Iniciar sesión
                            </button>
                        </>
                    )}
                </p>
            </div>
        </main>
    );
}
