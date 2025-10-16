import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Complement } from "@/types/products";
import {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
} from "./icons";

const iconMap: { [key: string]: React.FC<any> } = {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
};

interface ComplementsProps {
  complements: Complement[];
  maxVisible?: number;
  gapPx?: number;
}

export const Complements: React.FC<ComplementsProps> = ({
  complements,
  maxVisible,
  gapPx = 4,
}) => {
  if (!complements || complements.length === 0) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const ellipsisRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [visibleCount, setVisibleCount] = useState<number>(complements.length);

  const setChipRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) chipRefs.current.set(index, el);
    else chipRefs.current.delete(index);
  };

  const recalculate = () => {
    const container = containerRef.current;
    const ellipsisEl = ellipsisRef.current;

    if (!container || !ellipsisEl) return;

    const containerWidth = container.getBoundingClientRect().width;
    const ellipsisWidth = ellipsisEl.getBoundingClientRect().width;

    let used = 0;
    let count = 0;

    for (let i = 0; i < complements.length; i++) {
      const chipEl = chipRefs.current.get(i);
      if (!chipEl) return;

      const chipWidth = chipEl.getBoundingClientRect().width;
      const remaining = complements.length - (i + 1);
      const reserveEllipsis = remaining > 0 ? ellipsisWidth + gapPx : 0;

      if (used + chipWidth + reserveEllipsis <= containerWidth) {
        used += chipWidth + gapPx;
        count++;
      } else break;

      if (typeof maxVisible === "number" && count >= maxVisible) break;
    }

    setVisibleCount(count);
  };

  // medir al render inicial
  useLayoutEffect(() => {
    // esperar al próximo frame para asegurar que las fuentes e íconos cargaron
    requestAnimationFrame(() => recalculate());
  }, [complements]);

  // recalcular al redimensionar
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(() => recalculate());
    observer.observe(container);
    window.addEventListener("resize", recalculate);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", recalculate);
    };
  }, [complements, gapPx, maxVisible]);

  return (
    <div
      ref={containerRef}
      className="flex items-center w-full overflow-hidden"
      style={{ flexWrap: "nowrap" }}
    >
      {/* Contenedor de medición fuera de pantalla */}
      <div
        ref={measureRef}
        aria-hidden
        style={{
          position: "absolute",
          left: -9999,
          top: -9999,
          display: "flex",
          gap: `${gapPx}px`,
          whiteSpace: "nowrap",
          pointerEvents: "none",
          visibility: "visible", // importante para medir bien
        }}
      >
        {complements.map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`measure-${comp.id}-${idx}`}
              ref={setChipRef(idx)}
              className="inline-flex h-5 items-center justify-center gap-1 px-1.5 py-2 rounded-[30px] border border-solid border-[#808080]"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] whitespace-nowrap font-[Montserrat,Helvetica]">
                <span className="text-[#313131]">
                  {comp.minusComplement === true || comp.minusId
                    ? "0"
                    : comp.quantity}{" "}
                  {comp.name}
                </span>
                {comp.price != 0 && (
                  <span className="text-[#808080]"> (+${comp.price})</span>
                )}
              </span>
            </div>
          );
        })}
        <div
          ref={ellipsisRef}
          className="inline-flex items-center justify-center px-1.5 py-1 text-[12px]"
        >
          ...
        </div>
      </div>

      {/* Contenido visible */}
      <div
        className="flex items-center"
        style={{ gap: `${gapPx}px`, overflow: "hidden", whiteSpace: "nowrap" }}
      >
        {complements.slice(0, visibleCount).map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`visible-${comp.id}-${idx}`}
              className="inline-flex h-5 items-center justify-center gap-1 px-1.5 py-2 rounded-[30px] border border-solid border-[#808080]"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] whitespace-nowrap font-[Montserrat,Helvetica]">
                <span className="text-[#313131]">
                  {comp.minusComplement === true || comp.minusId
                    ? "0"
                    : comp.quantity}{" "}
                  {comp.name}
                </span>
                {comp.price != 0 && (
                  <span className="text-[#808080]"> (+${comp.price})</span>
                )}
              </span>
            </div>
          );
        })}

        {visibleCount < complements.length && (
          <div
            className="inline-flex items-center justify-center px-1.5 py-1 text-[12px] leading-[1] select-none"
            title={complements
              .slice(visibleCount)
              .map((c) => `${c.quantity} ${c.name}`)
              .join(", ")}
          >
            ...
          </div>
        )}
      </div>
    </div>
  );
};
