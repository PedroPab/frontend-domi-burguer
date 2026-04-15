"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { getIdToken } from "firebase/auth";
import { CodesService } from "@/services/codesService";
import { AlertTriangle, Gift } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Modal } from "@/components/ui/modal";
import { modalErrorVariants } from "@/components/ui/modal/variants";
import { cn } from "@/lib/utils";

interface UserCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const MAX_CODE_LENGTH = 12;

export function UserCodeModal({ isOpen, onClose, onSuccess }: UserCodeModalProps) {
  const { user } = useAuth();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= MAX_CODE_LENGTH) {
      setCode(value);
    }
  };

  const handleSubmit = async () => {
    if (!user || !code.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const token = await getIdToken(user);
      await CodesService.createCodeByUser(token, code);
      onSuccess?.();
      handleClose();
    } catch (err) {
      console.error("Error creando código:", err);
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setCode("");
    setError(null);
    onClose();
  };

  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Crear Mi Código"
      headerIcon={<Gift className="w-8 h-8 text-primary-red" />}
      size="md"
      footer={{
        cancel: { label: "CANCELAR" },
        confirm: {
          label: "CREAR MI CÓDIGO",
          onClick: handleSubmit,
          loading: isSubmitting,
          loadingText: "Creando código...",
          disabled: code.length < 3,
        },
      }}
    >
      <div className="space-y-4">
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-2">LEER ANTES DE CREAR TU CÓDIGO</p>
              <ul className="space-y-1 list-disc list-inside text-amber-700">
                <li>
                  Debes de tener como mínimo <strong>un pedido creado</strong> en la pagina web.
                </li>
                <li>
                  Solo puedes crear <strong>un único código</strong> de referido y <strong>NO se podrá cambiar</strong>.
                </li>
                <li>Te recomendamos que sea fácil de recordar y compartir.</li>
              </ul>
            </div>
          </div>
        </div>

        {error && <div className={cn(modalErrorVariants({ type: "error" }))}>{error}</div>}

        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Tu código personalizado
          </label>
          <Input
            value={code}
            onChange={handleCodeChange}
            placeholder="Ej: MICODIGO123"
            className="text-center text-lg font-semibold tracking-wider uppercase"
            maxLength={MAX_CODE_LENGTH}
          />
          <p className="mt-1 text-xs text-neutral-500 text-right">
            {code.length} / {MAX_CODE_LENGTH} caracteres
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-lg text-sm text-neutral-600">
          <p>
            Comparte este código con tus amigos y familiares. Cuando lo usen en su
            primer pedido, ambos recibirán beneficios especiales.
          </p>
        </div>

        <p className="text-xs text-center text-neutral-400">
          Al crear tu código, aceptas los{" "}
          <a
            href="/legal#referidos"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-neutral-600 transition-colors"
          >
            términos y condiciones
          </a>{" "}
          del programa de referidos.
        </p>
      </div>
    </Modal>
  );
}
