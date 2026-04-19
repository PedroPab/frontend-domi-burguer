import { PencilIcon } from "lucide-react";
import { CartItem } from "@/store/cartStore";

interface CartItemHeaderProps {
    item: CartItem;
    onEditComplements: (item: CartItem) => void;
}

export const CartItemHeader = ({ item, onEditComplements }: CartItemHeaderProps) => {
    return (
        <div className="grid grid-cols-[1fr_auto] gap-x-2 w-full items-start">
            <div className="font-h4 leading-tight line-clamp-2 break-words">{item.name}</div>
            {item.allowCustomization ? (
                <button
                    type="button"
                    className="flex items-center gap-1 cursor-pointer text-neutral-black-60 hover:text-neutral-black-80 transition-colors"
                    onClick={() => onEditComplements(item)}
                >
                    <span className="text-xs font-medium">Adiciones</span>
                    <PencilIcon className="w-4 h-4" />
                </button>
            ) : <span />}
        </div>
    );
};
