
import { PhoneNumberInput } from "@/components/ui/inputPhone";
import { useAuth } from "@/contexts/AuthContext";
import useFormCart from "@/hooks/cart/useFormcart";

const InputPhone = ({ }) => {

    const { user } = useAuth();

    const {
        formData,
        handlePhoneChange,
    } = useFormCart();
    // miramos si el usuario tiene un teléfono verificado
    if (user?.phoneNumber) {
        return (<>hola telefono verificado</>)

    } else if
        (user && !user.phoneNumber) {
        return (
            <>verifica tu numero</>
        )
    }

    //usuario no autenticado
    return (

        <div className="flex flex-col lg:flex-row w-full gap-2">
            <PhoneNumberInput
                className="pl-2 w-full"
                id="phone"
                name="phone"
                maxLength={20}
                placeholder="Escribe tu número de teléfono"
                onChange={handlePhoneChange}
                value={formData.phone}
            />
        </div>
    )
};

export default InputPhone;