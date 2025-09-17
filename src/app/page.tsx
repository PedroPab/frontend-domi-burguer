import {
  ArrowIcon,
  HamburgerIcon,
  HeartIcon,
  LeafIcon,
  LogoMobileRed,
} from "@/components/icons";
import { Button } from "@/components/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full items-end bg-white overflow-hidden">
      <main className="flex-1 flex flex-col w-full items-center">
        <section className="w-full py-12 sm:py-20 md:py-[140px]">
          <div className="max-w-screen-xl flex flex-col md:flex-row items-start md:items-start gap-8 md:gap-20">
            <div className="flex flex-col text-left">
              <div className="flex lg:gap-6 gap-0 lg:flex-row flex-col">
                <h1 className="font-extrabold text-primary-red text-[65px] sm:text-[100px] md:text-[110px] lg:text-[120px] sm:leading-22 leading-13 md:leading-25 xl:leading-none">
                  HOY!{" "}
                </h1>
                <h1 className="font-extrabold text-primary-red text-[65px] sm:text-[100px] md:text-[110px] lg:text-[120px] sm:leading-22 leading-13 md:leading-25 xl:leading-none">
                  {" "}
                  COMEMOS
                </h1>
              </div>

              <div className="flex flex-col md:flex-row md:justify-start gap-4 sm:gap-6">
                <h2 className="font-extrabold text-primary-red text-[65px] sm:text-[100px] md:text-[110px] lg:text-[120px] sm:leading-22 leading-13 md:leading-25 lg:leading-30 xl:leading-none">
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

        <section className="w-full py-0 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] justify-items-center place-items-center">
          {/* Card 1 */}
          <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 h-[400px] flex flex-col items-start gap-6 p-8 max-w-[410px]">
            <div>
              <HamburgerIcon className="w-10 h-10 text-black " />
            </div>

            <div className="flex flex-col items-start justify-center gap-5 w-full">
              <h2 className="font-h2 font-bold text-neutrosblack-80 text-[20px] md:text-[24px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
                {"SABOR\nCON ALMA"}
              </h2>

              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Trabajamos respetando los ingredientes, creemos en el poder de
                la comida para unir a las personas.
              </p>
              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Nuestra cocina es honesta y profundamente conectada con la
                comunidad que nos rodea.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 h-[400px] flex flex-col items-start gap-6 p-8 max-w-[410px]">
            <div>
              <HeartIcon className="w-10 h-10 text-black" />
            </div>

            <div className="flex flex-col items-start justify-center gap-5 w-full">
              <h2 className="font-h2 font-bold text-neutrosblack-80 text-[20px] md:text-[24px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
                {"SOLO INGREDIENTES\nFRESCOS"}
              </h2>

              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Elegimos lo mejor, directo del origen, y cultivamos relaciones
                reales con quienes comparten nuestra obsesión por la calidad.
              </p>
              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Nada congelado, nada genérico, todo fresco, todo sabroso
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 flex flex-col items-start gap-6 p-8 max-w-[410px]  card-center-span mx-auto">
            <div>
              <LeafIcon className="w-10 h-10 text-black" />
            </div>

            <div className="flex flex-col items-start justify-center gap-5 w-full">
              <h2 className="font-h2 font-bold text-neutrosblack-80 text-[20px] md:text-[24px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
                {"HECHA\nCON AMOR"}
              </h2>

              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Aquí cocinamos con alma.
              </p>
              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                Cada hamburguesa es preparada con cuidado, alegría y respeto por
                quienes la van a disfrutar.
              </p>
              <p className="font-body font-normal text-neutrosblack-80 text-[16px] md:text-[18px] leading-[22px] md:leading-[26px] whitespace-pre-line">
                La energía de la cocina y la dedicación familiar se sienten en
                cada mordida.
              </p>
            </div>
          </div>
        </section>

        <section className="flex flex-col xl:flex-row w-full items-start gap-20 py-20 relative">
          {/* Texto */}
          <div className="flex flex-col gap-8 flex-1 self-stretch relative max-w-[360px]">
            <h1 className="relative self-stretch mt-[-1px] text-neutral-black-80 font-bold text-[24px] leading-[25px]">
              ESTA HAMBURGUESERÍA
              <br />
              NACIÓ EN FAMILIA.
            </h1>

            <p className="relative self-stretch text-[#313131] font-montserrat font-normal text-base leading-[18px]">
              Entre risas, recetas heredadas y muchas charlas sobre la
              hamburguesa perfecta, construimos lo que hoy es nuestro orgullo.
              Respetamos a los clásicos pero le pusimos nuestra corazón, nuestro
              ritmo y nuestra salsa secreta.
            </p>

            <Button className="max-w-[230px] h-10 pl-5 text-[#FFF9E6] font-montserrat font-bold leading-[18px] rounded-[30px] gap-3 text-start justify-start text-[15px]">
              SÍGUENOS EN REDES
              <ArrowIcon className="w-[14px] h-[14px]" />
            </Button>
          </div>

          {/* Imágenes */}
          <div className="w-full overflow-x-auto flex gap-6 scrollbar-hide">
            <img
              className="w-[265px] h-[400px] flex-shrink-0"
              alt="Instagram image"
              src="/IGFoto1.png"
            />
            <img
              className="w-[271px] h-[400px] flex-shrink-0 mt-20"
              alt="Instagram image"
              src="/IGFoto2.png"
            />
            <img
              className="w-[258px] h-[400px] flex-shrink-0"
              alt="Instagram image"
              src="/IGFoto3.png"
            />
          </div>
        </section>
      </main>
    </div>
  );
}
