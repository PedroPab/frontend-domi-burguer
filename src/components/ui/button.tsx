import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "whitespace-nowrap font-bold",
    "transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-red/50",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
    "cursor-pointer select-none",
    "rounded-full",
  ],
  {
    variants: {
      variant: {
        // Nuevas variantes del sistema de diseño
        primary: [
          "bg-primary-red text-white",
          "hover:bg-[#E10300]",
          "active:bg-[#C40200]",
          "shadow-sm",
        ],
        "primary-light": [
          "bg-[#FECECE] text-primary-red",
          "hover:bg-[#FDB5B5]",
          "active:bg-[#FC9C9C]",
        ],
        outline: [
          "border-[1.5px] border-neutral-black-80 bg-transparent text-neutral-black-80",
          "hover:bg-neutral-black-10",
          "active:bg-neutral-black-20",
        ],
        dark: [
          "bg-neutral-black-80 text-white",
          "hover:bg-[#1a1a1a]",
          "active:bg-black",
          "shadow-sm",
        ],
        "dark-gray": [
          "bg-neutral-black-50 text-white",
          "hover:bg-[#666666]",
          "active:bg-[#555555]",
        ],
        "light-outline": [
          "bg-white border-[1.5px] border-neutral-black-20 text-neutral-black-80",
          "hover:bg-neutral-black-30",
          "active:bg-neutral-black-10",
        ],
        ghost: [
          "bg-transparent text-neutral-black-80",
          "hover:bg-neutral-black-10",
          "active:bg-neutral-black-20",
        ],
        link: [
          "text-primary-red underline-offset-4",
          "hover:underline",
          "p-0 h-auto",
        ],
        destructive: [
          "bg-red-600 text-white",
          "hover:bg-red-700",
          "active:bg-red-800",
          "shadow-sm",
        ],
        // Variantes legacy (para compatibilidad durante migración)
        default: [
          "bg-primary-red text-white",
          "hover:bg-[#E10300]",
          "active:bg-[#C40200]",
          "shadow-sm",
        ],
      },
      size: {
        sm: "h-8 px-3 text-sm",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-5 text-base",
        "icon-sm": "h-8 w-8 p-0",
        icon: "h-10 w-10 p-0",
        "icon-lg": "h-12 w-12 p-0",
        // Legacy
        default: "h-10 px-4 text-sm",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  badge?: number | string;
  loading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      fullWidth,
      asChild = false,
      leftIcon,
      rightIcon,
      badge,
      loading = false,
      loadingText,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, className }))}
        ref={ref}
        disabled={disabled || loading}
        aria-disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText && <span>{loadingText}</span>}
          </>
        ) : (
          <>
            {leftIcon && (
              <span className="[&>svg]:h-5 [&>svg]:w-5">{leftIcon}</span>
            )}
            {children}
            {rightIcon && (
              <span className="[&>svg]:h-5 [&>svg]:w-5">{rightIcon}</span>
            )}
            {badge !== undefined && (
              <span
                className={cn(
                  "flex items-center justify-center min-w-[1.25rem] h-5 px-1 rounded-full text-xs font-bold",
                  "bg-accent-yellow-10 text-neutral-black-80",
                )}
              >
                {badge}
              </span>
            )}
          </>
        )}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
