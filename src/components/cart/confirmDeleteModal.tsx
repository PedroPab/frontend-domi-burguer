"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Trash2 } from "lucide-react";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  productName: string;
}

export const ConfirmDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  productName,
}: ConfirmDeleteModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="flex flex-col justify-between p-9 z-500 bg-background rounded-2xl h-auto md:h-[240px] max-w-[450px]">
        <div className="flex flex-col items-center gap-4">
                    
          <DialogTitle className="text-center font-bold text-lg">
            ¿ELIMINAR ESTE PRODUCTO DEL PEDIDO?
          </DialogTitle>
          
          <p className="body-font text-center text-neutral-black-60">
            ¿Seguro que no quieres pensarlo dos veces?
          </p>
        </div>

        <div className="flex gap-3 mt-4 w-full justify-center">
          <Button
            type="button"
            variant="ghost"
            className="flex-1 max-w-[148px] rounded-[30px] h-[48px]"
            onClick={onClose}
          >
            NO, DÉJALO
          </Button>
          <Button
            type="button"
            className="flex-1 max-w-[148px] text-white rounded-[30px] h-[48px]"
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            SI, ELIMINAR
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};