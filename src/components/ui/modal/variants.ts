import { cva, type VariantProps } from "class-variance-authority";

// ============================================
// OVERLAY VARIANTS
// ============================================

export const modalOverlayVariants = cva([
  "fixed inset-0",
  "bg-black/60",
  "backdrop-blur-[2px]",
  "z-[400]",
  "data-[state=open]:animate-in data-[state=closed]:animate-out",
  "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
]);

// ============================================
// CONTENT CONTAINER VARIANTS
// ============================================

export const modalContentVariants = cva(
  [
    "fixed",
    "z-[500]",
    "bg-background",
    "shadow-lg",
    "focus:outline-none",
    "flex flex-col",
    "overflow-hidden",
  ],
  {
    variants: {
      size: {
        sm: "sm:max-w-[400px]",
        md: "sm:max-w-[500px]",
        lg: "sm:max-w-[650px]",
        xl: "sm:max-w-[820px]",
        full: "sm:max-w-[calc(100vw-2rem)] sm:max-h-[calc(100vh-2rem)]",
      },
      variant: {
        default: "",
        alert: "",
        confirm: "",
        form: "",
      },
      mobileMode: {
        bottomSheet: [
          // Mobile: bottom sheet
          "bottom-0 left-0 right-0",
          "rounded-t-2xl",
          "max-h-[90dvh]", // dvh respeta el teclado virtual en iOS
          "pb-[env(safe-area-inset-bottom)]", // Safe area para iPhone con notch
          // Desktop: centered
          "sm:bottom-auto sm:left-1/2 sm:top-1/2",
          "sm:-translate-x-1/2 sm:-translate-y-1/2",
          "sm:rounded-2xl",
          "sm:w-full",
          "sm:pb-0", // Reset safe area en desktop
        ],
        centered: [
          "left-1/2 top-1/2",
          "-translate-x-1/2 -translate-y-1/2",
          "rounded-2xl",
          "w-[calc(100%-2rem)]",
          "max-h-[calc(100dvh-2rem)]", // dvh para iOS
        ],
      },
    },
    compoundVariants: [
      // Alert variant - mas compacto
      {
        variant: "alert",
        size: "md",
        className: "sm:max-w-[400px]",
      },
      // Confirm variant - tamano medio
      {
        variant: "confirm",
        size: "md",
        className: "sm:max-w-[450px]",
      },
    ],
    defaultVariants: {
      size: "md",
      variant: "default",
      mobileMode: "bottomSheet",
    },
  }
);

// ============================================
// HEADER VARIANTS
// ============================================

export const modalHeaderVariants = cva(["flex flex-col", "px-6 pt-6", "sm:px-8 sm:pt-8"], {
  variants: {
    variant: {
      default: "text-left",
      alert: "text-center items-center",
      confirm: "text-center items-center",
      form: "text-left",
    },
    hasIcon: {
      true: "gap-4",
      false: "gap-1.5",
    },
  },
  defaultVariants: {
    variant: "default",
    hasIcon: false,
  },
});

// ============================================
// TITLE VARIANTS
// ============================================

export const modalTitleVariants = cva([
  "font-bold",
  "text-neutral-black-80",
  "leading-tight",
  "tracking-tight",
  "text-lg sm:text-xl",
]);

// ============================================
// DESCRIPTION VARIANTS
// ============================================

export const modalDescriptionVariants = cva([
  "text-neutral-black-50",
  "leading-relaxed",
  "text-sm sm:text-base",
]);

// ============================================
// BODY VARIANTS
// ============================================

export const modalBodyVariants = cva(["flex-1", "overflow-y-auto", "modal-scrollbar"], {
  variants: {
    padding: {
      none: "",
      sm: "px-4 py-3 sm:px-6 sm:py-4",
      md: "px-6 py-4 sm:px-8 sm:py-6",
      lg: "px-8 py-6 sm:px-10 sm:py-8",
    },
  },
  defaultVariants: {
    padding: "md",
  },
});

// ============================================
// FOOTER VARIANTS
// ============================================

export const modalFooterVariants = cva(
  [
    "border-t border-neutral-black-10",
    "px-6 py-4",
    "sm:px-8 sm:py-5",
    "bg-white/90 backdrop-blur",
    "supports-[backdrop-filter]:bg-white/60",
  ],
  {
    variants: {
      alignment: {
        start: "justify-start",
        center: "justify-center",
        end: "justify-end",
        between: "justify-between",
      },
      mobileDirection: {
        row: "flex flex-row gap-3",
        column: "flex flex-col gap-3",
        "column-reverse": "flex flex-col-reverse gap-3 sm:flex-row",
      },
    },
    defaultVariants: {
      alignment: "end",
      mobileDirection: "column-reverse",
    },
  }
);

// ============================================
// CLOSE BUTTON VARIANTS
// ============================================

export const modalCloseButtonVariants = cva([
  "absolute",
  "top-4 right-4 sm:top-6 sm:right-6",
  "p-2",
  "rounded-full",
  "text-neutral-black-50",
  "hover:text-neutral-black-80",
  "hover:bg-neutral-black-10",
  "transition-colors duration-150",
  "focus:outline-none focus:ring-2 focus:ring-primary-red/50",
  "z-10",
]);

// ============================================
// DRAG HANDLE VARIANTS (Mobile)
// ============================================

export const modalDragHandleVariants = cva([
  "mx-auto",
  "h-1.5 w-12",
  "rounded-full",
  "bg-neutral-black-20",
  "sm:hidden",
]);

// ============================================
// ICON CONTAINER VARIANTS
// ============================================

export const modalIconContainerVariants = cva(
  ["flex items-center justify-center", "rounded-full", "w-14 h-14"],
  {
    variants: {
      variant: {
        default: "bg-neutral-black-10",
        alert: "bg-accent-yellow-20",
        confirm: "bg-accent-yellow-20",
        form: "bg-primary-red/10",
        success: "bg-green-100",
        error: "bg-red-100",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

// ============================================
// ERROR MESSAGE VARIANTS
// ============================================

export const modalErrorVariants = cva(["text-sm", "text-center", "rounded-lg", "p-3"], {
  variants: {
    type: {
      error: "bg-red-50 text-red-700 border border-red-200",
      warning: "bg-amber-50 text-amber-700 border border-amber-200",
      success: "bg-green-50 text-green-700 border border-green-200",
      info: "bg-blue-50 text-blue-700 border border-blue-200",
    },
  },
  defaultVariants: {
    type: "error",
  },
});

// Export variant types
export type ModalOverlayVariants = VariantProps<typeof modalOverlayVariants>;
export type ModalContentVariants = VariantProps<typeof modalContentVariants>;
export type ModalHeaderVariants = VariantProps<typeof modalHeaderVariants>;
export type ModalBodyVariants = VariantProps<typeof modalBodyVariants>;
export type ModalFooterVariants = VariantProps<typeof modalFooterVariants>;
