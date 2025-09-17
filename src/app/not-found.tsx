import Link from "next/link";
import { Button } from "@/components/button";
export const metadata = {
    title: "¡Te perdiste! Esta página no existe 😅",
};


export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <h1 className="text-3xl font-bold mb-2">404 - Página no encontrada</h1>
            <p className="mb-8 text-neutral-600">La página que buscas no existe.</p>

            <Button
                size={"lg"}
                variant="outline"
                className="inline-flex h-10 lg:h-12 justify-center px-[10px] lg:px-5 lg:py-2  mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent"
            >
                <Link href="/">
                    Ir al menú principal
                </Link>
            </Button>
        </div>
    );
}
