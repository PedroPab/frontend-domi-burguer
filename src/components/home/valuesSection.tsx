import { HamburgerIcon, HeartIcon, LeafIcon } from "@/components/ui/icons";

export default function ValuesSection() {
  return (
    <section className="w-full py-0 grid grid-cols-[repeat(auto-fit,minmax(340px,1fr))] gap-6 sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))]">
      {/* Card 1 */}
      <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 h-[333px] flex flex-col items-start gap-6 p-8 max-w-[410px] mx-auto">
        <div>
          <HamburgerIcon className="w-9 h-9 text-black" />
        </div>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h2 className="font-h2 font-bold text-[20px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
            {"SABOR\nCON ALMA"}
          </h2>

          <p className="body-font text-[16px] whitespace-pre-line">
            Trabajamos respetando los ingredientes, creemos en el poder de la
            comida para unir a las personas.
          </p>
          <p className="body-font text-[16px] whitespace-pre-line">
            Nuestra cocina es honesta y profundamente conectada con la comunidad
            que nos rodea.
          </p>
        </div>
      </div>

      {/* Card 2 */}
      <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 h-[333px] flex flex-col items-start gap-6 p-8 max-w-[410px] mx-auto">
        <div>
          <HeartIcon className="w-9 h-9 text-black" />
        </div>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h2 className="font-h2 font-bold text-[20px] md:text-[24px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
            {"SOLO INGREDIENTES\nFRESCOS"}
          </h2>

          <p className="body-font text-[16px] whitespace-pre-line">
            Elegimos lo mejor, directo del origen, y cultivamos relaciones
            reales con quienes comparten nuestra obsesión por la calidad.
          </p>
          <p className="body-font text-[16px] whitespace-pre-line">
            Nada congelado, nada genérico, todo fresco, todo sabroso
          </p>
        </div>
      </div>

      {/* Card 3 */}
      <div className="flex-1 bg-accent-yellow-10 rounded-2xl border-0 flex flex-col items-start gap-6 p-8 max-w-[410px] h-[333px] card-center-span mx-auto">
        <div>
          <LeafIcon className="w-9 h-9 text-black" />
        </div>

        <div className="flex flex-col items-start justify-center gap-4 w-full">
          <h2 className="font-h2 font-bold text-[20px] md:text-[24px] leading-[22px] md:leading-[28px] tracking-0 whitespace-pre-line">
            {"HECHA\nCON AMOR"}
          </h2>

          <p className="body-font text-[16px] whitespace-pre-line">
            Aquí cocinamos con alma.
          </p>
          <p className="body-font text-[16px] whitespace-pre-line">
            Cada hamburguesa es preparada con cuidado, alegría y respeto por
            quienes la van a disfrutar.
          </p>
          <p className="body-font text-[16px] whitespace-pre-line">
            La energía de la cocina y la dedicación familiar se sienten en cada
            mordida.
          </p>
        </div>
      </div>
    </section>
  );
}
