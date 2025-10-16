import React from "react";

import { Complement } from "@/types/products";

interface ComplementsProps {
  complements: Complement[];
}

export const Complements: React.FC<ComplementsProps> = ({ complements }) => {
  if (complements.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-[4px_4px] w-full items-start">
      {complements.map((comp, index) => (
        <div
          key={index}
          className="inline-flex h-5 items-center justify-center gap-1 px-1.5 py-2 rounded-[30px] border border-solid border-[#808080]"
        >
          {comp.icon && <comp.icon className="w-3 h-3" />}

          <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] tracking-[0] whitespace-nowrap font-[Montserrat,Helvetica]">
            <span className="text-[#313131]">
              {comp.quantity} {comp.name}
            </span>
            {comp.price && (
              <span className="text-[#808080]"> (+${comp.price})</span>
            )}
          </span>

          {/* Si más adelante quieres mostrar un botón de cerrar */}
          {/* {comp.hasClose && (
            <img className="w-3 h-3" alt="Close" src="/close.svg" />
          )} */}
        </div>
      ))}
    </div>
  );
};
