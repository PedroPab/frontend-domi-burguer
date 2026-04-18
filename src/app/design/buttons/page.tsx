"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowRight, Plus, Trash2, Heart, Star } from "lucide-react";

// ─── Sección wrapper ────────────────────────────────────────────────────────
function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="mb-12">
      <h2 className="text-lg font-bold text-neutral-900 mb-1">{title}</h2>
      {description && <p className="text-sm text-neutral-500 mb-4">{description}</p>}
      <div className="flex flex-wrap gap-3 items-center">{children}</div>
    </section>
  );
}

// ─── Chip de etiqueta ────────────────────────────────────────────────────────
function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block bg-neutral-100 text-neutral-500 text-xs px-2 py-0.5 rounded font-mono mb-1">
      {children}
    </span>
  );
}

function ButtonWithLabel({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

// ─── Página ──────────────────────────────────────────────────────────────────
export default function ButtonsTestPage() {
  return (
    <div className="min-h-screen bg-white px-8 py-12 max-w-5xl mx-auto">
      <div className="mb-10 border-b pb-6">
        <h1 className="text-3xl font-bold text-neutral-900">Button Components</h1>
        <p className="text-neutral-500 mt-1">
          Catálogo de todas las variaciones del componente <code className="text-sm bg-neutral-100 px-1 rounded">{"<Button />"}</code>
        </p>
      </div>

      {/* ── Variantes ── */}
      <Section
        title="Variantes (variant)"
        description="Cada variante tiene un propósito semántico distinto."
      >
        <ButtonWithLabel label="primary">
          <Button variant="primary">Primary</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="primary-light">
          <Button variant="primary-light">Primary Light</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="yellow">
          <Button variant="yellow">Yellow</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="outline">
          <Button variant="outline">Outline</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="dark">
          <Button variant="dark">Dark</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="dark-gray">
          <Button variant="dark-gray">Dark Gray</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="light-outline">
          <Button variant="light-outline">Light Outline</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="ghost">
          <Button variant="ghost">Ghost</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="link">
          <Button variant="link">Link</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="destructive">
          <Button variant="destructive">Destructive</Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Tamaños ── */}
      <Section
        title="Tamaños (size)"
        description="Tres tallas para texto y tres para íconos."
      >
        <ButtonWithLabel label='size="sm"'>
          <Button size="sm">Small</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='size="md"'>
          <Button size="md">Medium</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='size="lg"'>
          <Button size="lg">Large</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='size="icon-sm"'>
          <Button size="icon-sm" variant="outline"><Plus /></Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='size="icon"'>
          <Button size="icon" variant="outline"><Plus /></Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='size="icon-lg"'>
          <Button size="icon-lg" variant="outline"><Plus /></Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Full width ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-neutral-900 mb-1">Full Width</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Prop <code className="bg-neutral-100 px-1 rounded text-xs">fullWidth</code> — ocupa el 100% del contenedor.
        </p>
        <div className="flex flex-col gap-3 w-full max-w-md">
          <ButtonWithLabel label="fullWidth primary">
            <Button variant="primary" fullWidth>Agregar al carrito</Button>
          </ButtonWithLabel>
          <ButtonWithLabel label="fullWidth outline">
            <Button variant="outline" fullWidth>Ver más</Button>
          </ButtonWithLabel>
        </div>
      </section>

      {/* ── Íconos ── */}
      <Section
        title="Con íconos (leftIcon / rightIcon)"
        description="Los íconos se pasan como nodos React. El botón ajusta el gap automáticamente."
      >
        <ButtonWithLabel label="leftIcon">
          <Button variant="primary" leftIcon={<ShoppingCart />}>
            Añadir
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="rightIcon">
          <Button variant="outline" rightIcon={<ArrowRight />}>
            Continuar
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="left + right">
          <Button variant="yellow" leftIcon={<Star />} rightIcon={<ArrowRight />}>
            Destacado
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="dark + leftIcon">
          <Button variant="dark" leftIcon={<Heart />}>
            Favorito
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="destructive + leftIcon">
          <Button variant="destructive" leftIcon={<Trash2 />}>
            Eliminar
          </Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Badge ── */}
      <Section
        title="Con badge (badge)"
        description="Muestra un contador en la esquina derecha. Útil para carrito o notificaciones."
      >
        <ButtonWithLabel label='badge={3}'>
          <Button variant="primary" leftIcon={<ShoppingCart />} badge={3}>
            Carrito
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='badge={99}'>
          <Button variant="outline" badge={99}>
            Notificaciones
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='badge="Nuevo"'>
          <Button variant="dark" badge="Nuevo">
            Pedidos
          </Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Loading ── */}
      <Section
        title="Estado de carga (loading)"
        description="Reemplaza el contenido con un spinner. Deshabilita el botón automáticamente."
      >
        <ButtonWithLabel label="loading (sin texto)">
          <Button variant="primary" loading>
            Enviar
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label='loadingText="Procesando..."'>
          <Button variant="primary" loading loadingText="Procesando...">
            Enviar
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="outline + loading">
          <Button variant="outline" loading loadingText="Cargando...">
            Ver más
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="dark + loading">
          <Button variant="dark" loading loadingText="Guardando...">
            Guardar
          </Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Disabled ── */}
      <Section
        title="Estado deshabilitado (disabled)"
        description="Reduce la opacidad e inhibe interacciones."
      >
        <ButtonWithLabel label="primary disabled">
          <Button variant="primary" disabled>Primary</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="outline disabled">
          <Button variant="outline" disabled>Outline</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="yellow disabled">
          <Button variant="yellow" disabled>Yellow</Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="destructive disabled">
          <Button variant="destructive" disabled>Destructive</Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Combinaciones reales ── */}
      <Section
        title="Combinaciones de uso real"
        description="Ejemplos tal como aparecen en la app."
      >
        <ButtonWithLabel label="Acción principal CTA">
          <Button variant="primary" size="lg" fullWidth leftIcon={<ShoppingCart />}>
            Finalizar pedido
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="Acción secundaria">
          <Button variant="primary-light" size="md">
            Ver menú completo
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="Confirmar eliminación">
          <Button variant="destructive" size="md" leftIcon={<Trash2 />}>
            Eliminar dirección
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="Icono solo (añadir)">
          <Button variant="primary" size="icon">
            <Plus />
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="Icono solo (eliminar)">
          <Button variant="ghost" size="icon">
            <Trash2 />
          </Button>
        </ButtonWithLabel>
        <ButtonWithLabel label="Carrito con items">
          <Button variant="dark" size="md" leftIcon={<ShoppingCart />} badge={5}>
            Mi pedido
          </Button>
        </ButtonWithLabel>
      </Section>

      {/* ── Variantes en fondo oscuro ── */}
      <section className="mb-12">
        <h2 className="text-lg font-bold text-neutral-900 mb-1">Variantes sobre fondo oscuro</h2>
        <p className="text-sm text-neutral-500 mb-4">
          Cómo se ven <code className="bg-neutral-100 px-1 rounded text-xs">ghost</code>,{" "}
          <code className="bg-neutral-100 px-1 rounded text-xs">light-outline</code> y{" "}
          <code className="bg-neutral-100 px-1 rounded text-xs">primary</code> sobre superficie oscura.
        </p>
        <div className="bg-neutral-900 rounded-2xl p-6 flex flex-wrap gap-4 items-center">
          <ButtonWithLabel label="ghost (dark bg)">
            <Button variant="ghost" className="text-white hover:bg-white/10">Ghost</Button>
          </ButtonWithLabel>
          <ButtonWithLabel label="light-outline (dark bg)">
            <Button variant="light-outline">Light Outline</Button>
          </ButtonWithLabel>
          <ButtonWithLabel label="primary (dark bg)">
            <Button variant="primary">Primary</Button>
          </ButtonWithLabel>
          <ButtonWithLabel label="yellow (dark bg)">
            <Button variant="yellow">Yellow</Button>
          </ButtonWithLabel>
        </div>
      </section>
    </div>
  );
}
