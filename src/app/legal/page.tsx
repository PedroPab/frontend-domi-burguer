'use client';

import Link from "next/link";
import { useState } from "react";

export default function LegalPage() {
    const [tab, setTab] = useState<"tos" | "privacy">("tos");

    return (
        <main className="min-h-screen bg-[#FFF6E1] text-neutral-800">
            {/* Header simple con breadcrumb y espacio reservado para logo */}
            <header className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 pt-6">
                <ol className="flex items-center gap-2">
                    <li>
                        <Link href="/" className="hover:text-neutral-700 underline-offset-2 hover:underline">Home</Link>
                    </li>
                    <li className="select-none">/</li>
                    <li className="text-neutral-800 font-medium">Legal</li>
                </ol>

                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">LEGAL</h1>
                        <p className="mt-2 max-w-2xl text-neutral-700">
                            En DomiBurger, creemos que la confianza también se cocina a fuego lento.
                            Por eso, esta página está hecha para contarte de forma clara y sin rodeos cómo usamos tu
                            información, qué derechos tienes como usuario y bajo qué reglas jugamos.
                        </p>
                    </div>
                    {/* Espacio reservado para el logo/mascota */}
                    <div className="ml-6 hidden sm:block" aria-hidden>
                        <div className="h-20 w-16 rounded-md opacity-70 border border-dashed border-neutral-300 grid place-items-center">
                            <span className="text-[10px] text-neutral-400">LOGO</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Layout principal */}
            <section className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Sidebar */}
                <aside className="lg:col-span-4 xl:col-span-3">
                    <div className="sticky top-4 space-y-3">
                        <button
                            type="button"
                            onClick={() => setTab("tos")}
                            aria-pressed={tab === "tos"}
                            className={[
                                "w-full rounded-full border px-5 py-3 text-left text-sm font-semibold transition",
                                tab === "tos"
                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                    : "bg-white/60 text-neutral-800 border-neutral-300 hover:bg-white"
                            ].join(" ")}
                        >
                            TÉRMINOS DE SERVICIO
                        </button>

                        <button
                            type="button"
                            onClick={() => setTab("privacy")}
                            aria-pressed={tab === "privacy"}
                            className={[
                                "w-full rounded-full border px-5 py-3 text-left text-sm font-semibold transition",
                                tab === "privacy"
                                    ? "bg-neutral-900 text-white border-neutral-900 shadow-sm"
                                    : "bg-white/60 text-neutral-800 border-neutral-300 hover:bg-white"
                            ].join(" ")}
                        >
                            POLÍTICAS DE PRIVACIDAD
                        </button>
                    </div>
                </aside>

                {/* Contenido */}
                <div className="lg:col-span-8 xl:col-span-9">
                    <article className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm ring-1 ring-black/5">
                        <p className="text-xs font-semibold tracking-wide text-neutral-500">ÚLTIMA ACTUALIZACIÓN, 16 DE JULIO DE 2025</p>

                        {tab === "tos" ? <TermsOfService /> : <PrivacyPolicy />}
                    </article>
                </div>
            </section>
        </main>
    );
}

function List({ children }: { children: React.ReactNode }) {
    return (
        <ul className="mt-3 space-y-3 [list-style:disc] pl-5 marker:text-neutral-400">
            {children}
        </ul>
    );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
    return (
        <section id={id} className="mt-6">
            <h2 className="text-xl font-extrabold tracking-tight text-neutral-900">{title}</h2>
            <div className="mt-2 text-neutral-800 leading-relaxed">{children}</div>
        </section>
    );
}

function TermsOfService() {
    return (
        <div>
            <p className="mt-4 max-w-3xl">
                Bienvenido a DomiBurger. Al usar nuestro sitio web, app, servicios de entrega o cualquier otro canal digital,
                aceptas estos Términos de Servicio.
            </p>

            <Section id="tos-1" title="1.0 ¿CÓMO FUNCIONAN NUESTROS SERVICIOS?">
                <List>
                    <li>Puedes realizar pedidos a través de nuestro sitio web o WhatsApp.</li>
                    <li>Al confirmar tu orden, aceptas el precio, el tiempo estimado de entrega y los productos seleccionados.</li>
                    <li>
                        Puedes personalizar tu hamburguesa retirando ingredientes, pero no aceptamos cambios después de confirmado el pedido.
                    </li>
                </List>
            </Section>

            <Section id="tos-2" title="2.0 MÉTODOS DE PAGO">
                <List>
                    <li>
                        Aceptamos pagos con tarjeta de crédito/débito, billeteras digitales y otras pasarelas seguras.
                    </li>
                    <li>
                        No almacenamos tu información bancaria directamente; usamos plataformas certificadas para ello.
                    </li>
                </List>
            </Section>

            <Section id="tos-3" title="3.0 CANCELACIONES Y DEVOLUCIONES">
                <List>
                    <li>No aceptamos cancelaciones después de que el pedido ha sido preparado.</li>
                    <li>
                        Si tu pedido llegó en mal estado o incompleto, contáctanos inmediatamente. Evaluaremos el caso y, si corresponde,
                        haremos una reposición o devolución del dinero.
                    </li>
                </List>
            </Section>
        </div>
    );
}

function PrivacyPolicy() {
    return (
        <div>
            <p className="mt-4 max-w-3xl">
                En DomiBurger, respetamos tu privacidad tanto como respetamos el punto de cocción de nuestra carne. Esta política
                explica cómo recolectamos, usamos y protegemos tus datos.
            </p>

            <Section id="pp-1" title="1.0 RECOLECCIÓN DE DATOS">
                <List>
                    <li>Nombre, dirección, teléfono, correo electrónico.</li>
                    <li>Información de pago (a través de pasarelas seguras).</li>
                    <li>Preferencias de pedido y comportamiento de navegación.</li>
                </List>
            </Section>

            <Section id="pp-2" title="2.0 USO DE TUS DATOS">
                <List>
                    <li>Para procesar tus pedidos correctamente.</li>
                    <li>Para mejorar tu experiencia en nuestra web/app.</li>
                    <li>Para enviarte ofertas.</li>
                </List>
            </Section>

            <Section id="pp-3" title="3.0 COMPARTIR INFORMACIÓN">
                <p className="mt-2">
                    Jamás vendemos tu información. Podemos compartirla con servicios de terceros como plataformas de pago u herramientas
                    de envío, pero solo para completar tu pedido y bajo estrictos acuerdos de confidencialidad.
                </p>
            </Section>

            <Section id="pp-4" title="4.0 PROTECCIÓN DE TU INFORMACIÓN">
                <p className="mt-2">
                    Usamos cifrado SSL, autenticación segura y almacenamos la menor cantidad de datos posible.
                </p>
            </Section>

            <Section id="pp-5" title="5.0 TUS DERECHOS">
                <p className="mt-2">
                    Puedes acceder, modificar o eliminar tus datos cuando quieras. Escríbenos y lo gestionamos.
                </p>
            </Section>
        </div>
    );
}