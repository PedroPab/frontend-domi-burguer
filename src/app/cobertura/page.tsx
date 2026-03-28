"use client";

import { LogoMobile } from "@/components/ui/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function CoberturaPage() {
    return (
        <main className="min-h-screen w-full text-neutral-800">

            <section className="mx-auto w-full max-w-6xl py-12 px-4 sm:px-6 lg:px-8 mt-10">
                <article className="rounded-2xl bg-white p-8 text-center">
                    <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 mb-6">
                        ZONA DE ENTREGA
                    </h2>

                    <p className="text-xl text-neutral-700 leading-relaxed mb-8">
                        Llevamos a toda el área metropolitana del Valle de Aburrá
                    </p>

                    <div className="flex justify-center">
                        <Button
                            size={"lg"}
                            variant="outline"
                            className="inline-flex h-10 lg:h-12 justify-center px-[10px] lg:px-5 lg:py-2  mt-[-8.00px] mb-[-8.00px] rounded-[30px] items-center bg-transparent"
                        >
                            <Link href="/">
                                ir a comprar
                            </Link>
                        </Button>
                    </div>
                </article>
            </section>
        </main>
    );
}
