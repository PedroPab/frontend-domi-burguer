"use client";

import * as React from "react";
import { Modal } from "../Modal";
import type { ModalProps } from "../types";

interface ListModalProps<T> extends Omit<ModalProps, "children"> {
  /** Items a mostrar */
  items: T[];
  /** Render function para cada item */
  renderItem: (item: T, index: number) => React.ReactNode;
  /** Mensaje cuando no hay items */
  emptyMessage?: string;
  /** Key extractor */
  keyExtractor?: (item: T, index: number) => string;
}

export function ListModal<T>({
  items,
  renderItem,
  emptyMessage = "No hay elementos para mostrar",
  keyExtractor = (_, index) => String(index),
  footer = false,
  ...props
}: ListModalProps<T>) {
  return (
    <Modal size="lg" footer={footer} {...props}>
      {items.length === 0 ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-neutral-black-50">{emptyMessage}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {items.map((item, index) => (
            <React.Fragment key={keyExtractor(item, index)}>{renderItem(item, index)}</React.Fragment>
          ))}
        </div>
      )}
    </Modal>
  );
}
