"use client";

import * as DialogPrimitive from "@radix-ui/react-dialog";
import { motion, useMotionValue, animate } from "framer-motion";
import { useDrag } from "react-use-gesture";
import * as React from "react";
import { cn } from "@/lib/utils";
import { useIsMounted } from "@/hooks/useIsMounted";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 bg-black/60 z-50",
      "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

type DialogContentProps = React.ComponentPropsWithoutRef<
  typeof DialogPrimitive.Content
> & {
  onOpenChange?: (open: boolean) => void;
  /** Contenido del footer que permanece siempre visible */
  footer?: React.ReactNode;
  /** Clases para el área scrollable del cuerpo */
  bodyClassName?: string;
};

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  DialogContentProps
>(({ className, children, onOpenChange, footer, bodyClassName, ...props }, ref) => {
  const isMounted = useIsMounted();
  const y = useMotionValue(0);

  const bind = useDrag(
    ({ down, movement: [, my], direction: [, dy] }) => {
      if (down) {
        y.set(my);
      } else {
        if (my > 100 && dy > 0.5) {
          animate(y, window.innerHeight, {
            onComplete: () => onOpenChange?.(false),
          });
        } else {
          animate(y, 0, { type: "spring", stiffness: 300, damping: 30 });
        }
      }
    },
    { initial: () => [0, y.get()], bounds: { top: 0 }, rubberband: true }
  );

  if (!isMounted) return null;

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  return (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        asChild
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white shadow-lg",
          "sm:bottom-auto sm:left-1/2 sm:top-1/2 sm:w-[600px] sm:translate-x-[-50%] sm:translate-y-[-50%] sm:rounded-lg",
          className
        )}
        {...props}
      >
        <motion.div
          {...(isMobile ? bind() : {})}
          style={isMobile ? { y } : {}}
          initial={isMobile ? { y: "100%" } : { opacity: 0 }}
          animate={isMobile ? { y: 0 } : { opacity: 1 }}
          exit={isMobile ? { y: "100%" } : { opacity: 0 }}
          transition={isMobile ? { type: "spring", stiffness: 300, damping: 30 } : { duration: 0.2 }}
          onAnimationComplete={() => { if (isMobile) y.set(0); }}
          className="w-full sm:max-h-[85vh]"
        >
          {/* Layout columna: cuerpo scroll + footer fijo */}
          <div className="flex max-h-[85vh] flex-col overflow-hidden">
            {/* Handle móvil */}
            <div className="sm:hidden mt-3 mx-auto mb-2 h-1.5 w-20 rounded-full bg-neutral-300" />

            {/* Cuerpo scrollable */}
            <div className={cn("flex-1 overflow-y-auto px-1 pt-4 pb-4 sm:px-8 sm:pt-6", bodyClassName)}>
              {children}
            </div>

            {/* Footer fijo */}
            {footer && (
              <div className="border-t px-6 py-4 sm:px-8 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                {footer}
              </div>
            )}
          </div>
        </motion.div>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left px-8 pt-6 sm:pt-8", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

/* exports */
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
