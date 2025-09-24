import * as React from "react";
import { cn } from "../../lib/utils";

interface SeparatorProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(
  ({ className, orientation = "horizontal", ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn(
          "shrink-0 bg-border bg-[#E6E6E6]",
          orientation === "horizontal"
            ? "h-[1px] w-full sm:w-[80%] md:w-[60%] lg:w-[40%]"
            : "w-[1px] h-full sm:h-[80%] md:h-[60%] lg:h-[40%]",
          className
        )}
        {...props}
      />
    );
  }
);

Separator.displayName = "Separator";

export { Separator };
