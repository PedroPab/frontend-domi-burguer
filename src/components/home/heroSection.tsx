"use client";

import { LogoMobileRed } from "@/components/ui/icons";

export default function HeroSection() {
  return (
    <section className="w-full py-12 sm:py-20 md:py-[110px]">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-start md:items-start gap-8 md:gap-20">
        <div className="flex flex-col text-left">
          <div className="flex lg:gap-6 gap-0 lg:flex-row flex-col">
            <h1 className="font-extrabold! text-primary-red! text-[65px]! sm:text-[100px]! md:text-[110px]! lg:text-[120px]! sm:leading-22! leading-13! md:leading-25! xl:leading-none!">
              HOY!{" "}
            </h1>
            <h1 className="font-extrabold! text-primary-red! text-[65px]! sm:text-[100px]! md:text-[110px]! lg:text-[120px]! sm:leading-22! leading-13! md:leading-25! xl:leading-none!">
              {" "}
              COMEMOS
            </h1>
          </div>

          <div className="flex flex-col md:flex-row md:justify-start gap-4 sm:gap-6">
            <h2 className="font-extrabold! text-primary-red! text-[65px]! sm:text-[100px]! md:text-[110px]! lg:text-[120px]! sm:leading-22! leading-13! md:leading-25! lg:leading-30! xl:leading-none!">
              RICO
            </h2>

            <div className="flex items-center gap-6 sm:gap-12 md:gap-8">
              <LogoMobileRed className="w-[66px] h-[100px]" />
              <LogoMobileRed className="w-[66px] h-[100px]" />
              <LogoMobileRed className="w-[66px] h-[100px]" />
              <LogoMobileRed className="w-[66px] h-[100px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
