"use client";

import React from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WorkingOnModal = ({ isOpen, onClose }: ModalProps) => {
  return (
    <Modal
      open={isOpen}
      onOpenChange={(open) => !open && onClose()}
      title="ESTAMOS TRABAJANDO EN ESTA FUNCIÓN"
      size="lg"
      footer={{
        confirm: {
          label: "CERRAR",
          variant: "ghost",
          onClick: onClose,
          className: "bg-accent-yellow-40 hover:bg-accent-yellow-60 text-neutral-black-80",
        },
        cancel: false,
        alignment: "center",
      }}
    >
      <div className="flex flex-col gap-4 text-center">
        <p className="text-neutral-600">
          Nuestro equipo está trabajando arduamente para implementarla y
          ofrecerte la mejor experiencia posible.
        </p>
        <p className="text-neutral-600">
          Mientras tanto, te invitamos a explorar otras características de
          nuestra aplicación. ¡Gracias por tu paciencia y comprensión!
        </p>
        <div className="flex justify-center">
          <Image
            src="/catWork.jpg"
            alt="Gato trabajando"
            className="w-[200px] h-[200px] md:w-[250px] md:h-[250px] object-contain"
            width={200}
            height={400}
          />
        </div>
      </div>
    </Modal>
  );
};
