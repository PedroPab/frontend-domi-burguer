import * as React from "react";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { Input } from "./input"; // tu Input
import { cn } from "../../lib/utils";
import type { Complement } from "@/types/products"; // si hace falta

// Tipo de props del PhoneInput inferido directamente
type PhoneInputPropsFromLib = React.ComponentProps<typeof PhoneInput>;

// Nuestro tipo público: omitimos lo que manejamos internamente
export interface CustomPhoneInputProps
  extends Omit<PhoneInputPropsFromLib, "inputComponent" | "className"> {
  className?: string;
  inputClassName?: string;
}

/**
 * Nota: react-phone-number-input pasará props al input interno que no son exactamente
 * las props estándar de un <input>, por eso el wrapper usa `any` para los props que
 * le pasan. Si quieres, puedes tiparlas más estrictamente según la versión de la librería.
 */
const PhoneNumberInput = React.forwardRef<HTMLDivElement, CustomPhoneInputProps>(
  ({ className, inputClassName, ...props }, ref) => {
    // Wrapper que recibe las props del PhoneInput y las reenvía a tu Input
    // Usamos forwardRef para que la librería pueda pasar el ref al input interno
    const InternalInput = React.useMemo(() => {
      return React.forwardRef<HTMLInputElement, any>((inputProps, inputRef) => {
        // La librería suele pasar `className`, `value`, `onChange`, `name`, etc.
        const { className: innerClassName, ...rest } = inputProps || {};
        return (
          <Input
            // reenvía el ref al input real
            ref={inputRef as any}
            // combina clases del wrapper (si la librería pasa className) con inputClassName
            className={cn(innerClassName ?? "", inputClassName ?? "")}
            {...(rest as any)}
          />
        );
      });
    }, [inputClassName]);

    return (
      <div className={cn("phone-input-container", className)} ref={ref}>
        {/* casteamos InternalInput porque la librería no tiene tipos exactos para inputComponent */}
        <PhoneInput
          {...(props as any)}
          defaultCountry="CO"
          inputComponent={InternalInput as any}
        />
      </div>
    );
  }
);

PhoneNumberInput.displayName = "PhoneNumberInput";
export { PhoneNumberInput };
