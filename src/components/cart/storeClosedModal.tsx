"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Clock } from "lucide-react";

interface StoreClosedModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  opensAt?: string;
}

export const StoreClosedModal = ({
  isOpen,
  onClose,
  message,
  opensAt,
}: StoreClosedModalProps) => {
  useEffect(() => {
    const handlePopState = () => onClose();

    if (isOpen) {
      window.history.pushState({ StoreClosedModal: true }, "");
      window.addEventListener("popstate", handlePopState);
    } else if (window.history.state?.StoreClosedModal) {
      window.history.back();
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [isOpen, onClose]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className="flex flex-col p-6 pt-0 z-500 bg-background rounded-2xl w-full sm:max-w-[400px]"
        aria-describedby="tienda-cerrada"
      >
        <div className="flex flex-col justify-center items-center gap-4 mt-4">
          <div className="w-16 h-16 rounded-full bg-accent-yellow-20 flex items-center justify-center">
            <Clock className="w-8 h-8 text-accent-yellow-80" />
          </div>

          <DialogTitle className="text-center font-bold text-lg">
            ¡Lo sentimos!
          </DialogTitle>

          <div className="flex flex-col gap-2 text-center">
            <p className="body-font text-neutral-black-80 font-bold">
              {message}
            </p>

            {opensAt && (
              <p className="body-font text-neutral-black-60">
                Abrimos {opensAt}
              </p>
            )}

            <div className="mt-2 p-3 bg-accent-yellow-10 rounded-lg">
              <p className="body-font text-sm font-bold text-neutral-black-80">
                Horario de atención:
              </p>
              <p className="body-font text-sm text-neutral-black-60">
                Lunes a Sábado: 4:30 PM - 10:00 PM
              </p>
              <p className="body-font text-sm text-neutral-black-60">
                Domingos: Cerrado
              </p>
            </div>
          </div>
        </div>
        <div className="flex w-full justify-center">
          <Button
            type="button"
            className="w-full max-w-[400px] rounded-[30px] h-[48px] mt-4"
            onClick={onClose}
          >
            ENTENDIDO
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
