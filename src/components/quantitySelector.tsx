import { Minus, Plus } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Button } from "@/components/button";

const quantityWrapperVariants = cva(
  "flex items-center justify-center border rounded-[50px]",
  {
    variants: {
      size: {
        sm: "h-8 gap-4 px-[3px] py-2 border-[1.2px] border-[#313131] w-fit",
        lg: "h-[48px] gap-6 px-1.5 py-2",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

const quantityButtonVariants = cva(
  "bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60",
  {
    variants: {
      size: {
        sm: "w-6 h-6 p-0 rounded-[40px]",
        lg: "w-[38px] h-[38px] rounded-[30px]",
      },
    },
    defaultVariants: {
      size: "sm",
    },
  }
);

export interface QuantitySelectorProps
  extends VariantProps<typeof quantityWrapperVariants> {
  value: number;
  onIncrease: () => void;
  onDecrease: () => void;
}

export function QuantitySelector({
  value,
  onIncrease,
  onDecrease,
  size,
}: QuantitySelectorProps) {
  return (
    <div
      className={cn(
        quantityWrapperVariants({ size }),
        size === "lg" && (value < 10 ? "w-[142px]" : "w-[153px]")
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={onDecrease}
        className={cn(quantityButtonVariants({ size }))}
      >
        <Minus className={cn(size === "sm" ? "w-4 h-4" : "w-5 h-5")} />
      </Button>

      <span
        className={cn(
          "font-bold text-neutrosblack-80 tracking-[0] whitespace-nowrap",
          size === "sm"
            ? "text-xs leading-[18px] font-montserrat"
            : "label-font text-base"
        )}
      >
        {size === "sm" ? String(value).padStart(2, "0") : value}
      </span>

      <Button
        variant="ghost"
        size="sm"
        onClick={onIncrease}
        className={cn(quantityButtonVariants({ size }))}
      >
        <Plus className={cn(size === "sm" ? "w-4 h-4" : "w-5 h-5")} />
      </Button>
    </div>
  );
}
