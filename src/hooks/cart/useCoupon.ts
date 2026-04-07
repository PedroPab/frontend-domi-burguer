import { useState, useCallback, useEffect, useRef } from "react";
import { Code } from "@/types/codes";
import { CodesService } from "@/services/codesService";
import { getIdToken } from "firebase/auth";
import { useAuth } from "@/contexts/AuthContext";
import { useAppliedCodeStore } from "@/store/appliedCodeStore";

interface UseCouponReturn {
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: Code | null;
  isLoading: boolean;
  error: string | null;
  applyCoupon: () => Promise<void>;
  removeCoupon: () => void;
}

export const useCoupon = (): UseCouponReturn => {
  const [couponCode, setCouponCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const hasAttemptedAutoApply = useRef(false);

  const { user } = useAuth();

  // Usar el store persistente para el código aplicado
  const { appliedCode, setAppliedCode, removeAppliedCode } =
    useAppliedCodeStore();

  // Sincronizar el estado local del input con el código guardado
  useEffect(() => {
    if (appliedCode && !couponCode) {
      setCouponCode(appliedCode.code);
    }
  }, [appliedCode, couponCode]);

  // Auto-aplicar código de referido guardado en localStorage
  useEffect(() => {
    const autoApplyPendingCode = async () => {
      // Solo intentar una vez y si hay usuario autenticado
      if (hasAttemptedAutoApply.current || !user || appliedCode) return;

      const pendingCode = localStorage.getItem("pendingReferralCode");
      if (!pendingCode) return;

      hasAttemptedAutoApply.current = true;

      try {
        setIsLoading(true);
        const token = await getIdToken(user);
        const response = await CodesService.getCodeId(token, pendingCode);
        const code = response.body[0];

        // Validaciones
        if (code.status !== "active") {
          localStorage.removeItem("pendingReferralCode");
          return;
        }

        if (code.expirationDate && new Date(code.expirationDate) < new Date()) {
          localStorage.removeItem("pendingReferralCode");
          return;
        }

        if (code.usageLimit && code.usageCount >= code.usageLimit) {
          localStorage.removeItem("pendingReferralCode");
          return;
        }

        // Código válido - aplicarlo automáticamente
        setAppliedCode(code);
        setCouponCode(code.code);
        localStorage.removeItem("pendingReferralCode");
      } catch {
        // Si hay error, simplemente no aplicamos el código
        localStorage.removeItem("pendingReferralCode");
      } finally {
        setIsLoading(false);
      }
    };

    autoApplyPendingCode();
  }, [user, appliedCode, setAppliedCode]);

  const applyCoupon = useCallback(async () => {
    if (!couponCode.trim()) {
      setError("Ingresa un código de cupón");
      return;
    }

    if (!user) {
      setError("Debes iniciar sesión para aplicar un cupón");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = await getIdToken(user);
      const response = await CodesService.getCodeId(token, couponCode.trim());
      const code = response.body[0];

      if (code.status !== "active") {
        setError("Este código no está activo");
        return;
      }

      if (code.expirationDate && new Date(code.expirationDate) < new Date()) {
        setError(
          "Este código ya expiró. Mantente atento a nuestras próximas promos"
        );
        return;
      }

      if (code.usageLimit && code.usageCount >= code.usageLimit) {
        setError("Este código ha alcanzado su límite de uso");
        return;
      }

      // Guardar el código validado en el store persistente
      setAppliedCode(code);
      setError(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Error al validar el cupón";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [couponCode, user, setAppliedCode]);

  const removeCoupon = useCallback(() => {
    console.log("Removiendo cupón aplicado");
    removeAppliedCode();
    setCouponCode("");
    setError(null);
  }, [removeAppliedCode]);

  return {
    couponCode,
    setCouponCode,
    appliedCoupon: appliedCode, // Usar el código del store persistente
    isLoading,
    error,
    applyCoupon,
    removeCoupon,
  };
};
