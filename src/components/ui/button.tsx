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
        // PRIMARY - RED 80 base
        primary: [
          "bg-primary-red text-white",           // RED 80 (#E73533)
          "hover:bg-primary-red-100",            // RED 100 (#E10300)
          "active:bg-primary-red-100",
          "shadow-sm",
        ],
        // YELLOW/ACCENT - MIKADO 40 base
        yellow: [
          "bg-accent-yellow-40 text-neutral-black-80", // MIKADO 40 (#FFE79B)
          "hover:bg-accent-yellow-60",                 // MIKADO 60 (#FFDA69)
          "active:bg-accent-yellow-80",                // MIKADO 80 (#FFCE37)
        ],
        // OUTLINE - Transparent with BLACK 90 border
        outline: [
          "border-[1.5px] border-neutral-black-80 bg-transparent text-neutral-black-80",
          "hover:bg-neutral-black-10",           // BLACK 10 (#E6E6E6)
          "active:bg-neutral-black-20",          // BLACK 20 (#CCCCCC)
        ],
        // DARK - BLACK 90 base
        dark: [
          "bg-neutral-black-80 text-white",      // BLACK 90 (#313131)
          "hover:bg-neutral-black-100",          // BLACK 100 (#000000)
          "active:bg-neutral-black-100",
          "shadow-sm",
        ],
        // DARK GRAY - BLACK 50 base
        "dark-gray": [
          "bg-neutral-black-50 text-white",      // BLACK 50 (#808080)
          "hover:bg-neutral-black-80",           // BLACK 90 (#313131)
          "active:bg-neutral-black-80",
        ],
        // LIGHT OUTLINE - White with BLACK 20 border
        "light-outline": [
          "bg-white border-[1.5px] border-neutral-black-20 text-neutral-black-80",
          "hover:bg-neutral-black-3",            // BLACK 3 (#F7F7F7)
          "active:bg-neutral-black-10",          // BLACK 10 (#E6E6E6)
        ],
        // GHOST - Transparent
        ghost: [
          "bg-transparent text-neutral-black-80",
          "hover:bg-neutral-black-10",           // BLACK 10 (#E6E6E6)
          "active:bg-neutral-black-20",          // BLACK 20 (#CCCCCC)
        ],
        // LINK
        link: [
          "text-primary-red underline-offset-4", // RED 80 (#E73533)
          "hover:underline",
          "p-0 h-auto",
        ],
        // DESTRUCTIVE - RED 100 base (más oscuro)
        destructive: [
          "bg-primary-red-100 text-white",       // RED 100 (#E10300)
          "hover:bg-[#C40200]",                  // Darker red
          "active:bg-[#A30200]",
          "shadow-sm",
        ],
        // Legacy (alias de primary)
        default: [
          "bg-primary-red text-white",
          "hover:bg-primary-red-100",
          "active:bg-primary-red-100",
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
                  "flex items-center justify-center min-w-[1.5rem] h-6 px-1.5 rounded-full text-sm font-bold",
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
