// Main components
export { Modal, ModalHeader, ModalBody, ModalFooter, useModalContext, useIsMobile } from "./Modal";

// Types
export type {
  ModalProps,
  ModalHeaderProps,
  ModalBodyProps,
  ModalFooterProps,
  ModalButtonConfig,
  ModalFooterConfig,
  ModalSize,
  ModalVariant,
  ModalContextValue,
} from "./types";

// Variants
export {
  modalOverlayVariants,
  modalContentVariants,
  modalHeaderVariants,
  modalBodyVariants,
  modalFooterVariants,
  modalCloseButtonVariants,
  modalDragHandleVariants,
  modalIconContainerVariants,
  modalErrorVariants,
} from "./variants";

// Presets
export { AlertModal, ConfirmModal, FormModal, ListModal } from "./presets";
