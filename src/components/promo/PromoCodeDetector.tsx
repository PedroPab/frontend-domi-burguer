"use client";

import { useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CodesService } from "@/services/codesService";
import { useAppliedCodeStore } from "@/store/appliedCodeStore";
import { addToast } from "@heroui/toast";

export function PromoCodeDetector() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const { appliedCode } = useAppliedCodeStore();

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || appliedCode) return;

    const detect = async () => {
      try {
        const response = await CodesService.getCodeByIdPublic(code.trim().toUpperCase());
        const fetchedCode = response.body;

        const isExpired =
          fetchedCode.expirationDate &&
          new Date(fetchedCode.expirationDate) < new Date();
        const isInactive = fetchedCode.status !== "active";
        if (isExpired || isInactive) return;

        localStorage.setItem("pendingReferralCode", fetchedCode.code);
        addToast({
          title: "Código promocional detectado",
          description: `El código ${fetchedCode.code} se aplicará automáticamente a tu pedido`,
          variant: "solid",
          color: "success",
        });
      } catch {
        // Código inválido o no encontrado — no hacer nada
      } finally {
        const params = new URLSearchParams(searchParams.toString());
        params.delete("code");
        const newUrl = params.toString() ? `${pathname}?${params}` : pathname;
        router.replace(newUrl);
      }
    };

    detect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
