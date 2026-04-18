import { QuantitySelector } from "@/components/ui/quantitySelector";

interface CartItemFooterProps {
    id: string;
    price: number;
    quantity: number;
    onDecrease: (id: string, quantity: number) => void;
    onIncrease: (id: string, quantity: number) => void;
}

export const CartItemFooter = ({ id, price, quantity, onDecrease, onIncrease }: CartItemFooterProps) => {
    return (
        <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
            <h4>${price.toLocaleString("es-CO")} X {quantity}</h4>
            <QuantitySelector
                size="sm"
                value={quantity}
                onDecrease={() => onDecrease(id, quantity)}
                onIncrease={() => onIncrease(id, quantity)}
            />
        </div>
    );
};
