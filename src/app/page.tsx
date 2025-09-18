import {
  ArrowIcon,
  CarneIcon,
  EditarIcon,
  HamburgerIcon,
  HeartIcon,
  LeafIcon,
  LogoMobileRed,
  QuesoIcon,
  TocinetaIcon,
  TomateIcon,
} from "@/components/icons";
import { Button } from "@/components/button";
import { Minus, Plus } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen w-full items-end bg-white overflow-visible ">
      <main className="flex-1 flex flex-col w-full items-center ">
        <section className="grid grid-cols-1 xl:grid-cols-2 gap-0 max-w-[1440px] w-screen ">
          {/* Columna 1 */}
          <div className="flex flex-col items-start justify-center gap-2 bg-[linear-gradient(45deg,rgba(255,194,5,1)_0%,rgba(255,194,5,0.4)_100%)] max-w-[720px] w-full mx-auto relative">
            <div className="w-full h-[140px]" />

            <div className="relative flex-1 w-full flex justify-center">
              <img
                className="w-full max-w-[720px] h-auto"
                alt="Vector"
                src="/hamburgerBig.png"
              />
              <div className="w-full max-w-[720px] px-[13%] py-0 absolute top-[43%] left-0 flex justify-between">
                <Button className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accentmikado-20 pr-5">
                  <ArrowIcon className="w-5 h-5 rotate-180 text-neutral-black-80" />
                </Button>
                <Button className="w-10 h-10 md:w-14 md:h-14 bg-accent-yellow-20 rounded-[30px] hover:bg-accentmikado-20 pl-5">
                  <ArrowIcon className="w-5 h-5 text-neutral-black-80" />
                </Button>
              </div>
            </div>

          </div>

          {/* Columna 2 */}
          <div className="flex flex-col items-center justify-center gap-14 p-20 bg-accent-yellow-10 max-w-[720px] w-full mx-auto">
            <div className="flex flex-col w-[400px] items-center gap-6">
              <div>
                <h1 className="text-center ">HAMBURGUESA</h1>
                <h1 className="text-center ">ARTESANAL</h1>
              </div>
              <div className="flex items-center justify-center gap-5">
                <CarneIcon />
                <TomateIcon />
                <QuesoIcon />
                <TocinetaIcon />
              </div>
              <p className="text-center body-font max-w-[350px]">
                Pan brioche dorado, carne jugosa, tocineta crocante, lechuga
                fresca, tomate y el toque de nuestra salsa secreta.
              </p>
              <Button
                variant="ghost"
                className="px-4 py-2 w-[177px] h-[40px] bg-accent-yellow-20 hover:bg-accent-yellow-40  rounded-[30px]"
              >
                PERSONALIZAR <EditarIcon className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex w-full max-w-[720px] items-center justify-center gap-6">
              <div className="flex items-center justify-center gap-6 px-1.5 py-2 border rounded-[50px] max-w-[154px] w-[154px] h-[48px]">
                <Button
                  variant="ghost"
                  className="w-[38px] h-[38px] bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px]"
                >
                  <Minus />
                </Button>
                <span className="label-font">01</span>
                <Button
                  variant="ghost"
                  className="w-[38px] h-[38px] bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px]"
                >
                  <Plus />
                </Button>
              </div>
              <div>
                <h1 className="font-bold text-[28px] md:text-[32px] leading-[30px] md:leading-[28px] !important">
                  $18.900
                </h1>
              </div>
            </div>

            <div className="flex w-full max-w-[720px] items-center justify-center gap-6">
              <Button className="text-white rounded-[30px] flex items-center gap-2 text-[16px] w-[199px] h-[48px]">
                <HamburgerIcon className="w-6 h-6" />
                PAGAR AHORA
              </Button>
              <Button
                variant="ghost"
                className="bg-accent-yellow-40 hover:bg-accent-yellow-60 active:bg-accent-yellow-60 rounded-[30px] flex items-center gap-2 text-[16px] w-[199px] h-[48px]"
              >
                AÑADIR AL CARRITO
              </Button>
            </div>
          </div>
        </section>

        <section className="grid lg:gap-y-14 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 items-center justify-center lg:gap-6 gap-2 gap-x-4 py-14 relative">
          <div
            className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 bg-accent-yellow-40 rounded-2xl border-0 overflow-visible`}
          >
            <div
              className={`${"flex relative flex-col items-center justify-center gap-[4.47px] overflow-visible"} p-0 h-full`}
            >
              <img
                className="absolute top-[8px] left-[36px] lg:top-[-30px] h-[149px] w-[94px] lg:w-[140.16px] lg:h-[220px] object-cover"
                alt="Burger"
                src="/Burger1.png"
              />

              <Button
                size="icon"
                className="absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 bg-primary-red hover:bg-primary-red/90 rounded-[30px] p-0"
              >
                <Plus className="text-white"/>
              </Button>
            </div>
          </div>
          <div
            className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 bg-accent-yellow-20 rounded-2xl border-0 overflow-visible`}
          >
            <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
              <img
                className="absolute top-[8px] left-[25px] lg:top-[-30px] lg:left-[45px] h-[149px] w-[94px] lg:w-[140.16px] lg:h-[220px] object-cover"
                alt="Burger"
                src="/Burger1.png"
              />

              <img
                className="absolute top-[35px] left-[68px] lg:top-[23px] lg:left-[121px] w-[84px] h-[126px] lg:w-[119px] lg:h-[178px] object-cover"
                alt="Burger"
                src="/DomiburgerPapitas.png"
              />

              <Button
                size="icon"
                className="absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 bg-primary-red hover:bg-primary-red/90 rounded-[30px] p-0"
              >
                <Plus className="text-white" />
              </Button>
            </div>
          </div>
          <div
            className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 bg-accent-yellow-20 rounded-2xl border-0 overflow-visible`}
          >
            <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
              <img
                className="absolute top-[28px] lg:top-[-30px] w-[178px] h-[128px] lg:w-[308px] lg:h-[221px]"
                alt="Burger"
                src="/DomiburgerSalsa.png"
              />

              <Button
                size="icon"
                className="absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 bg-primary-red hover:bg-primary-red/90 rounded-[30px] p-0"
              >
                <Plus className="text-white" />
              </Button>
            </div>
          </div>
          <div
            className={`w-[160px] h-[160px] lg:w-[280px] lg:h-40 bg-accent-yellow-20 rounded-2xl border-0 overflow-visible`}
          >
            <div className={`${"relative gap-[4.47px]"} p-0 h-full`}>
              <img
                className="absolute top-[-0px] left-[26px] lg:top-[-38px] lg:left-[69px] w-[110px] h-[166px] lg:w-[153px] lg:h-[230px] object-cover"
                alt="Burger"
                src="/DomiburgerPapitas2.png"
              />

              <Button
                size="icon"
                className="absolute top-[5px] right-[5px] lg:top-[7px] lg:left-[232px] w-8 h-8 lg:w-10 lg:h-10 bg-primary-red hover:bg-primary-red/90 rounded-[30px] p-0"
              >
                <Plus className="text-white" />
              </Button>
            </div>
          </div>
        </section>

        <section className="w-full py-12 sm:py-20 md:py-[110px]">
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

        <section className="w-full py-0 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] ">
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
          <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 flex flex-col items-start gap-6 p-8 max-w-[410px] card-center-span mx-auto">
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
