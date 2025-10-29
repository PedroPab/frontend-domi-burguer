"use client";

import { LogoMobile } from "@/components/ui/icons";
import { useState } from "react";

export default function LegalPage() {
  const [tab, setTab] = useState<"tos" | "privacy">("tos");

  return (
    <main className="min-h-screen w-full text-neutral-800">
      <header className="relative left-1/2 right-1/2 -mx-[50vw] w-screen bg-[#FFF6E1] pb-10 pt-30 md:pt-40 px-5 sm:px-10 md:px-10 lg:px-10 xl:px-16 mb-2">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 flex h-full items-end justify-between">
          <div className="max-w-[480px]">
            <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 mb-4">
              LEGAL
            </h1>
            <p className="body-font">
              En DomiBurger, creemos que la confianza también se cocina a fuego
              lento. Por eso, esta página está hecha para contarte de forma
              clara y sin rodeos cómo usamos tu información, qué derechos tienes
              como usuario y bajo qué reglas jugamos.
            </p>
          </div>

          <div className="ms-4">
            <LogoMobile width={51} height={72} />
          </div>
        </div>
      </header>

      {/* Layout principal */}
      <section className="mx-auto w-full max-w-6xl py-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="lg:col-span-4 xl:col-span-3">
          <div className="sticky top-4 space-y-3">
            <button
              type="button"
              onClick={() => setTab("tos")}
              aria-pressed={tab === "tos"}
              className={[
                "w-[243px] rounded-full border px-5 py-3 text-left text-sm font-semibold transition",
                tab === "tos"
                  ? "text-neutral-black-80 border-neutral-900 shadow-sm"
                  : "bg-white/60 text-neutral-800 border-neutral-300 hover:bg-white",
              ].join(" ")}
            >
              TÉRMINOS DE SERVICIO
            </button>

            <button
              type="button"
              onClick={() => setTab("privacy")}
              aria-pressed={tab === "privacy"}
              className={[
                "w-[243px] rounded-full border px-5 py-3 text-left text-sm font-semibold transition",
                tab === "privacy"
                  ? "text-neutral-black-80 border-neutral-900 shadow-sm"
                  : "bg-white/60 text-neutral-800 border-neutral-300 hover:bg-white",
              ].join(" ")}
            >
              POLÍTICAS DE PRIVACIDAD
            </button>
          </div>
        </aside>

        <div className="lg:col-span-8 xl:col-span-9">
          <article className="rounded-2xl bg-white p-6 px-2">
            <p className="text-xs font-semibold tracking-wide text-neutral-500">
              ÚLTIMA ACTUALIZACIÓN, 16 DE JULIO DE 2025
            </p>

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

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mt-6">
      <h2 className="text-xl font-extrabold tracking-tight mb-7 text-neutral-900">
        {title}
      </h2>
      <div className="mt-2 ps-2 text-neutral-800 leading-relaxed">{children}</div>
    </section>
  );
}

function TermsOfService() {
  return (
    <div>
      <p className="mt-4 max-w-3xl">
        Bienvenido a DomiBurger. Al usar nuestro sitio web, app, servicios de
        entrega o cualquier otro canal digital, aceptas estos Términos de
        Servicio.
      </p>

      <Section id="tos-1" title="1.0 ¿CÓMO FUNCIONAN NUESTROS SERVICIOS?">
        <List>
          <li>
            Puedes realizar pedidos a través de nuestro sitio web o WhatsApp.
          </li>
          <li>
            Al confirmar tu orden, aceptas el precio, el tiempo estimado de
            entrega y los productos seleccionados.
          </li>
          <li>
            Puedes personalizar tu hamburguesa retirando ingredientes, pero no
            aceptamos cambios después de confirmado el pedido.
          </li>
        </List>
      </Section>

      <Section id="tos-2" title="2.0 MÉTODOS DE PAGO">
        <List>
          <li>
            Aceptamos pagos con tarjeta de crédito/débito, billeteras digitales
            y otras pasarelas seguras.
          </li>
          <li>
            No almacenamos tu información bancaria directamente; usamos
            plataformas certificadas para ello.
          </li>
        </List>
      </Section>

      <Section id="tos-3" title="3.0 CANCELACIONES Y DEVOLUCIONES">
        <List>
          <li>
            No aceptamos cancelaciones después de que el pedido ha sido
            preparado.
          </li>
          <li>
            Si tu pedido llegó en mal estado o incompleto, contáctanos
            inmediatamente. Evaluaremos el caso y, si corresponde, haremos una
            reposición o devolución del dinero.
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
        En DomiBurger, respetamos tu privacidad tanto como respetamos el punto
        de cocción de nuestra carne. Esta política explica cómo recolectamos,
        usamos y protegemos tus datos.
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
          Jamás vendemos tu información. Podemos compartirla con servicios de
          terceros como plataformas de pago u herramientas de envío, pero solo
          para completar tu pedido y bajo estrictos acuerdos de
          confidencialidad.
        </p>
      </Section>

      <Section id="pp-4" title="4.0 PROTECCIÓN DE TU INFORMACIÓN">
        <p className="mt-2">
          Usamos cifrado SSL, autenticación segura y almacenamos la menor
          cantidad de datos posible.
        </p>
      </Section>

      <Section id="pp-5" title="5.0 TUS DERECHOS">
        <p className="mt-2">
          Puedes acceder, modificar o eliminar tus datos cuando quieras.
          Escríbenos y lo gestionamos.
        </p>
      </Section>
    </div>
  );
}
