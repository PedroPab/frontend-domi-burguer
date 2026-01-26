
interface PaymentMethod {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    iconClass: string;
    selected: boolean;
}
export type { PaymentMethod };