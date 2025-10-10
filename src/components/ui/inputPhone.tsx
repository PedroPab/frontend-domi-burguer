import * as React from "react";
// Importa PhoneInput de la librería
import 'react-phone-number-input/style.css';
import PhoneInput, { PhoneInputProps } from "react-phone-number-input";
// Asumiendo que tu componente Input se exporta desde un archivo como `../ui/input`
import { Input } from "./input"; // O la ruta correcta a tu archivo de Input
import { cn } from "../../lib/utils"; // Tu función de utilidades

// Definición de Props para el nuevo componente. 
// Usamos las props de PhoneInput, pero hacemos opcionales las que se manejan internamente
// y agregamos la prop `className` para el contenedor.
interface CustomPhoneInputProps extends Omit<PhoneInputProps<typeof Input>, 'inputComponent' | 'className'> {
  // `className` será para el contenedor principal de PhoneInput (que incluye el selector de país)
  className?: string;
  // `inputClassName` será para pasar clases específicas a tu componente Input estilizado
  inputClassName?: string;
}


const PhoneNumberInput = React.forwardRef<HTMLDivElement, CustomPhoneInputProps>(
  ({ className, inputClassName, ...props }, ref) => {

    // ⚠️ ATENCIÓN: La librería `react-phone-number-input` no usa `ref` para el contenedor,
    // sino para el campo de texto interno. Como estamos usando `inputComponent` con nuestro 
    // `Input` ya estilizado, es más limpio que este componente principal no reenvíe un `ref`.
    // Sin embargo, si lo quieres usar para el contenedor (el div que engloba al selector y al input), 
    // deberías usar `React.forwardRef<HTMLDivElement, ...>` y pasarlo al `div` principal.

    return (
      <div className={cn("phone-input-container", className)} ref={ref}>
        <PhoneInput
          // Tu componente Input personalizado. La librería se encarga de pasarle 'value', 'onChange' y 'ref'.
          inputComponent={Input}

          // `defaultCountry` es una prop muy recomendada para establecer el país por defecto
          defaultCountry="CO" // Ejemplo: Colombia

          // La prop `className` de PhoneInput afecta al contenedor del componente de la librería.
          // Para darle clases a tu <input/>, usa `inputClassName` y asegúrate de que tu `Input`
          // acepte el `className` estándar y lo aplique. ¡Tu `Input` ya lo hace!
          // No hay una prop directa para *clases* en el input, sino que todas las demás props 
          // se pasan a `inputComponent`.

          // Para pasar clases a tu `Input` desde aquí, se requiere un pequeño ajuste:
          // Crear un wrapper que pase `inputClassName` a tu `Input` solo para las clases.
          // **Alternativa más limpia**: Simplemente asegura que tu componente `Input` ya tenga 
          // todos los estilos que quieres y solo dependa de la `value` y `onChange` de la librería.

          // Pasamos el resto de las props (como `value`, `onChange`, `placeholder`, `country`, etc.)
          {...props}

        // Aquí puedes pasar un objeto de props al input interno si fuera necesario, 
        // aunque con tu `inputComponent` bien definido, no debería ser estrictamente necesario.
        // Esto es más para el PhoneInput por defecto.
        // numberInputProps={{ className: inputClassName }} // Opcional, para algunos forks de la librería.
        />
      </div>
    );
  }
);
PhoneNumberInput.displayName = "PhoneNumberInput";

export { PhoneNumberInput };