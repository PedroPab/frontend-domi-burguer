"use client";

import { useRouter } from "next/navigation";
import { KitchenModal } from "@/components/kitchen/kitchenModal";

export default function CoberturaPage() {
    const router = useRouter();

    const handleClose = () => {
        router.replace("/");
    };

    return (
        <KitchenModal isOpen={true} onClose={handleClose} handleBackButton={false} />
    );
}
