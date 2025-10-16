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
import { X } from "lucide-react";

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
  onRemove?: (complementId: number) => void;
}

export const Complements: React.FC<ComplementsProps> = ({
  complements,
  maxVisible,
  gapPx = 4,
  onRemove,
}) => {
  if (!complements || complements.length === 0) return null;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const ellipsisRef = useRef<HTMLDivElement | null>(null);
  const chipRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [visibleCount, setVisibleCount] = useState<number>(complements.length);

  const setChipRef = (index: number) => (el: HTMLDivElement | null) => {
    if (el) chipRefs.current.set(index, el);
    else chipRefs.current.delete(index);
  };

  const recalculate = () => {
    const container = containerRef.current;
    if (!container) return;

    const containerWidth = container.clientWidth;

    const ellipsisEl = ellipsisRef.current;
    const ellipsisWidth = ellipsisEl ? ellipsisEl.offsetWidth : 24;

    let used = 0;
    let count = 0;

    for (let i = 0; i < complements.length; i++) {
      const chipEl = chipRefs.current.get(i);
      if (!chipEl) {
        // Si todavía no se midió, no forzamos límite
        count = complements.length;
        break;
      }

      const chipWidth = chipEl.offsetWidth;
      const remaining = complements.length - (i + 1);
      const reserveEllipsis = remaining > 0 ? ellipsisWidth + gapPx : 0;

      if (used + chipWidth + reserveEllipsis <= containerWidth) {
        used += chipWidth + gapPx;
        count++;
      } else {
        break;
      }

      if (typeof maxVisible === "number" && count >= maxVisible) break;
    }

    setVisibleCount(count);
  };

  useLayoutEffect(() => {
    recalculate();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complements]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ro = new ResizeObserver(() => {
      recalculate();
    });
    ro.observe(container);

    window.addEventListener("resize", recalculate);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recalculate);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [complements, gapPx, maxVisible]);

  return (
    <div
      ref={containerRef}
      className="flex items-center w-full overflow-hidden"
      style={{ flexWrap: "nowrap" }}
    >
      {/* Chips invisibles para medición precisa */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          visibility: "hidden",
          pointerEvents: "none",
          height: 0,
          overflow: "hidden",
          whiteSpace: "nowrap",
        }}
      >
        {complements.map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`measure-${comp.id}-${idx}`}
              ref={setChipRef(idx)}
              className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080] mr-[4px]"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] tracking-[0] whitespace-nowrap font-[Montserrat,Helvetica]">
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
              {onRemove && (
                <button
                  className="ml-1 flex items-center justify-center w-3 h-3 rounded-full"
                >
                  <X size={8} />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Chips visibles */}
      <div
        className="flex items-center"
        style={{ gap: `${gapPx}px`, overflow: "hidden", whiteSpace: "nowrap" }}
      >
        {complements.slice(0, visibleCount).map((comp, idx) => {
          const IconComponent = comp.icon ? iconMap[comp.icon] : null;
          return (
            <div
              key={`visible-${comp.id}-${idx}`}
              className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080]"
            >
              {IconComponent && <IconComponent className="w-3 h-3" />}
              <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] tracking-[0] whitespace-nowrap font-[Montserrat,Helvetica]">
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
              {onRemove && (
                <button
                  onClick={() => onRemove(comp.id)}
                  className="flex items-center justify-center w-3 h-3 rounded-full hover:bg-neutral-200 cursor-pointer"
                >
                  <X size={30} />
                </button>
              )}
            </div>
          );
        })}

        {visibleCount < complements.length && (
          <div
            ref={ellipsisRef}
            className="inline-flex items-center justify-center px-1.5 py-1 text-[12px] leading-[1] select-none"
            aria-hidden={false}
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
