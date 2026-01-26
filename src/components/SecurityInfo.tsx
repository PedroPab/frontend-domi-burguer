import { Card, CardContent } from "./ui/card";
import { CuponIcon, HamburgerIcon, MapPinIcon, ShieldIcon } from "./ui/icons";

const SecurityInfo = () => {
  return (
    <>
      <Card className="flex flex-col items-start min-h-[209px]  p-6 w-full bg-neutral-black-30 rounded-[12px] border-0">
        <CardContent className="p-0 w-full">
          <h5 className="mt-[-1.00px] body-font font-bold mb-4">
            ¿Por qué guardar tus datos?
          </h5>

          <p className="body-font mb-4">
            Accede a beneficios exclusivos como:
          </p>

          <div className="inline-flex flex-col gap-3 items-start mr-[-16.00px]">
            <div className="flex w-full items-center gap-4">
              <CuponIcon className="" />
              <p className=" body-font text-[15px]!">
                Cupones de descuento y sorpresas especiales solo para
                miembros.
              </p>
            </div>
            <div className="flex w-full items-center  gap-4">
              <HamburgerIcon width={16} height={16} />
              <p className=" body-font text-[15px]!">
                Acceso más rápido a tus pedidos favoritos.
              </p>
            </div>
            <div className="flex w-full items-center  gap-4">
              <MapPinIcon width={16} height={16} />
              <p className=" body-font text-[15px]!">
                Acceso más rápido a tus pedidos favoritos.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-start gap-2 w-full rounded-xl">
        <div className="flex flex-col w-full items-start justify-center gap-6">
          <div className="flex items-center gap-3 w-full">
            <ShieldIcon />
            <p className="body-font">
              Guardaremos tu información de forma segura
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SecurityInfo;