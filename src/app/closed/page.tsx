"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { HamburgerIcon } from "@/components/ui/icons";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ClosedForHolidays() {
  return (
    <main className="flex-1 flex flex-col w-full items-center mt-[130px] lg:mt-[130px] mb-[100px]">
      <section className="grid grid-cols-1 xl:grid-cols-2 gap-0 max-w-[1440px] w-screen overflow-visible">
        {/* Columna 1 - Imagen */}
        <div className="flex flex-col items-start justify-center gap-2 max-w-[720px] w-full mx-auto relative order-2 xl:order-1">
          <div className="w-full aspect-[1/1] relative h-full bg-accent-yellow-20 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-[120px] md:text-[180px] xl:text-[220px]"
            >
              🎄
            </motion.div>
          </div>
        </div>

        {/* Columna 2 - Contenido */}
        <div className="flex flex-col items-center justify-center gap-6 xl:gap-10 p-[20px] py-[60px] xl:p-20 bg-primary-red max-w-[720px] min-h-[400px] xl:min-h-[742px] w-full mx-auto order-1 xl:order-2">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col w-full items-center gap-6"
          >
            {/* Iconos decorativos */}
            <div className="flex items-center gap-4 text-4xl md:text-5xl">
              <motion.span
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              >
                🎅
              </motion.span>
              <motion.span
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              >
                ⭐
              </motion.span>
              <motion.span
                animate={{ rotate: [0, -10, 10, 0] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.5 }}
              >
                🎁
              </motion.span>
            </div>

            {/* Título principal */}
            <div>
              <h1 className="text-center text-[28px] md:text-[36px] xl:text-[42px] font-extrabold text-white leading-tight">
                ¡ESTAMOS CERRADOS
                <br />
                POR NAVIDAD!
              </h1>
            </div>

            {/* Subtítulo */}
            <h4 className="text-center text-white text-[16px] md:text-[18px] font-semibold">
              NOS TOMAMOS UN DESCANSO PARA CELEBRAR
            </h4>

            {/* Mensaje */}
            <p className="text-center text-white/90 max-w-[400px] text-[14px] md:text-[16px] leading-relaxed">
              Gracias por acompañarnos este año. Regresamos muy pronto con más
              hamburguesas deliciosas para ti este viernes.
            </p>

            {/* Mensaje de año nuevo */}
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-accent-yellow-40 rounded-[20px] px-6 py-4 mt-2"
            >
              <p className="text-center text-neutral-black-80 font-bold text-[16px] md:text-[18px]">
                🎉 ¡Les deseamos un Feliz Navidad a todos! 🎉
              </p>
            </motion.div>

            {/* Fecha de regreso (opcional) */}
            <p className="text-center text-white/70 text-[13px] md:text-[14px]">
              Volvemos el 26 de diciembre
            </p>
          </motion.div>

          {/* Botón de regreso */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex w-full max-w-[720px] items-center justify-center gap-6 mt-4"
          >
            <Link href={"/"}>
              <Button
                variant="ghost"
                className="bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] h-[48px] px-6"
              >
                <HamburgerIcon className="w-6 h-6" />
                VER MENÚ
              </Button>
            </Link>
          </motion.div>

          {/* Copos de nieve decorativos */}
          <div className="flex items-center gap-3 text-2xl opacity-60 mt-4">
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            >
              ❄️
            </motion.span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.3 }}
            >
              ❄️
            </motion.span>
            <motion.span
              animate={{ y: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.6 }}
            >
              ❄️
            </motion.span>
          </div>
        </div>
      </section>
    </main>
  );
}
