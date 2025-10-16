import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Complement } from "@/types/products";
import {
  CarneIcon,
  FrenchFriesIcon,
  LechugaIcon,
  LogoProps,
  PicklesIcon,
  QuesoIcon,
  SouceIcon,
  TocinetaIcon,
  TomateIcon,
} from "./icons";
import { X } from "lucide-react";

const iconMap: { [key: string]: React.FC<LogoProps> } = {
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
  onRemove?: (complementId: number) => void;
}

export const Complements: React.FC<ComplementsProps> = ({
  complements,
  maxVisible,
  gapPx = 4,
  onRemove,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const measureRef = useRef<HTMLDivElement | null>(null);
  const [visibleCount, setVisibleCount] = useState<number>(complements.length);

  const calculateVisible = () => {
    const container = containerRef.current;
    const measureContainer = measureRef.current;
    
    if (!container || !measureContainer) return;

    const containerWidth = container.offsetWidth;
    const badgeWidth = 30; // Ancho aproximado del "+N"
    
    // Obtener todos los chips medidos
    const chips = Array.from(measureContainer.children) as HTMLElement[];
    
    let totalWidth = 0;
    let count = 0;

    for (let i = 0; i < chips.length; i++) {
      const chipWidth = chips[i].offsetWidth;
      const isLast = i === chips.length - 1;
      const hasMore = i < complements.length - 1;
      
      // Si no es el último chip, reservar espacio para el badge
      const spaceNeeded = totalWidth + chipWidth + (hasMore && !isLast ? badgeWidth + gapPx : 0);
      
      if (spaceNeeded <= containerWidth) {
        totalWidth += chipWidth + gapPx;
        count++;
      } else {
        break;
      }

      // Respetar maxVisible si está definido
      if (typeof maxVisible === "number" && count >= maxVisible) {
        break;
      }
    }

    setVisibleCount(count);
  };

  // Calcular cuando cambian los complementos
  useLayoutEffect(() => {
    const timeoutId = setTimeout(() => {
      calculateVisible();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [complements, maxVisible, gapPx]);

  // Recalcular en resize
  useEffect(() => {
    let resizeTimeout: NodeJS.Timeout;

    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        calculateVisible();
      }, 100);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      clearTimeout(resizeTimeout);
      window.removeEventListener("resize", handleResize);
    };
  }, [complements, maxVisible, gapPx]);

  if (!complements || complements.length === 0) return null;

  const hiddenCount = complements.length - visibleCount;

  return (
    <>
      {/* Contenedor invisible para medir */}
      <div
        ref={measureRef}
        aria-hidden="true"
        className="fixed -top-[9999px] left-0 flex items-center pointer-events-none"
        style={{ gap: `${gapPx}px`, visibility: "hidden" }}
      >
        {complements.map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`measure-${comp.id}-${idx}`}
              className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080] flex-shrink-0"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] sm:text-[9px] whitespace-nowrap font-[Montserrat,Helvetica]">
                <span className="text-[#313131]">
                  {comp.minusComplement === true || comp.minusId
                    ? "0"
                    : comp.quantity}{" "}
                  {comp.name}
                </span>
                {comp.price !== 0 && (
                  <span className="text-[#808080]"> (+${comp.price})</span>
                )}
              </span>
              {onRemove && (
                <span className="ml-0.5 w-3 h-3" />
              )}
            </div>
          );
        })}
      </div>

      {/* Contenedor visible */}
      <div
        ref={containerRef}
        className="flex items-center w-full overflow-hidden"
        style={{
          gap: `${gapPx}px`,
          flexWrap: "nowrap",
        }}
      >
        {complements.slice(0, visibleCount).map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`${comp.id}-${idx}`}
              className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080] flex-shrink-0"
            >
              {IconComponent && <IconComponent className="w-3 h-3 flex-shrink-0" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] sm:text-[9px] whitespace-nowrap font-[Montserrat,Helvetica]">
                <span className="text-[#313131]">
                  {comp.minusComplement === true || comp.minusId
                    ? "0"
                    : comp.quantity}{" "}
                  {comp.name}
                </span>
                {comp.price !== 0 && (
                  <span className="text-[#808080]"> (+${comp.price})</span>
                )}
              </span>
              {onRemove && (
                <button
                  onClick={() => onRemove(comp.id)}
                  className="ml-0.5 flex items-center justify-center w-3 h-3 rounded-full hover:bg-neutral-200 flex-shrink-0"
                >
                  <X size={8} />
                </button>
              )}
            </div>
          );
        })}

        {hiddenCount > 0 && (
          <div
            className="inline-flex items-center justify-center px-1.5 h-5 text-[9px] font-medium leading-[1] select-none flex-shrink-0 text-neutral-black-80"
            title={complements
              .slice(visibleCount)
              .map((c) => `${c.quantity} ${c.name}`)
              .join(", ")}
          >
            +{hiddenCount}
          </div>
        )}
      </div>
    </>
  );
};