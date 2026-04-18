import { PencilIcon } from "lucide-react";
import { CartItem } from "@/store/cartStore";

interface CartItemHeaderProps {
    item: CartItem;
    onEditComplements: (item: CartItem) => void;
}

export const CartItemHeader = ({ item, onEditComplements }: CartItemHeaderProps) => {
    return (
        <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
            <div className="gap-3 self-stretch w-full flex items-center">
                <div className="flex-1 font-h4">{item.name}</div>
                {item.allowCustomization && (
                    <button
                        className="flex items-center gap-1 cursor-pointer text-neutral-black-60 hover:text-neutral-black-80 transition-colors"
                        onClick={() => onEditComplements(item)}
                    >
                        <PencilIcon className="w-4 h-4" />
                        <span className="text-xs font-medium">Personalizar</span>
                    </button>
                )}
            </div>
        </div>
    );
};
