import Link from "next/link";
import { LogoDesktop, LogoMobile } from "@/components/ui/icons";

export const NavLogo = () => {
  return (
    <div className="flex flex-col w-[130px] h-14 items-center justify-center gap-2">
      <div className="hidden md:block w-[106px] h-14">
        <Link href={"/"} className="focus:outline-0! focus:ring-0!">
          <LogoDesktop height={58} width={106} />
        </Link>
      </div>
      <div className="block md:hidden">
        <Link href={"/"}>
          <LogoMobile width={28} height={40} />
        </Link>
      </div>
    </div>
  );
};
