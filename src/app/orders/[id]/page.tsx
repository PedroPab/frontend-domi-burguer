"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  BancolombiaIcon,
  MoneyIcon,
  NequiIcon,
  SpikesIcon,
} from "@/components/ui/icons";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, ArrowLeft } from "lucide-react";
import { Order, OrderItem as OrderItemType } from "@/types/orders";
import { OrderService } from "@/services/orderService";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderDetailPageProps {
  params: {
    id: string;
  };
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchOrder = async () => {
      if (!user) {
        router.push("/login");
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const token = await user.getIdToken();
        const response = await OrderService.getOrderById(params.id, token);
        setOrder(response.body);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Error al cargar el pedido";
        setError(errorMessage);
        console.error("Error fetching order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [user, params.id, router]);

  const handleCancelOrder = async () => {
    if (!order || !user) return;

    try {
      const token = await user.getIdToken();
      const response = await OrderService.cancelOrder(order.id, token);
      setOrder(response.body);
    } catch (error) {
      console.error("Error cancelling order:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
          <p className="text-gray-600">Cargando detalles del pedido...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md p-8 text-center">
          <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
          <p className="text-gray-600 mb-6">
            {error || "Pedido no encontrado"}
          </p>
          <Button onClick={() => router.push("/orders")} className="w-full">
            Volver a Mis Pedidos
          </Button>
        </Card>
      </div>
    );
  }

  const statusInfo = OrderService.getOrderStatusInfo(order.status);
  const canCancel = ["pending", "confirmed"].includes(order.status);

  const paymentMethodLabel: Record<string, string> = {
    cash: "Efectivo",
    bancolombia: "Bancolombia",
    nequi: "Nequi",
  };

  const PaymentIcon: Record<string, React.FC<{ className?: string }>> = {
    cash: MoneyIcon,
    bancolombia: BancolombiaIcon,
    nequi: NequiIcon,
  };

  const CurrentPaymentIcon = PaymentIcon[order.paymentMethod];

  return (
    <div className="flex flex-col xl:flex-row w-full xl:justify-around items-center xl:items-start gap-5 mt-[130px] lg:mt-[130px] mb-[100px]">
      {/* Columna izquierda: Info del pedido */}
      <div className="flex h-full w-full pb-10 max-w-[500px]">
        <div className="flex flex-col h-full gap-6 w-full mt-5">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/orders")}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </Button>
            <h2 className="items-start">PEDIDO #{order.orderNumber}</h2>
          </div>

          {/* Estado del pedido */}
          <div
            className={`flex h-10 items-center gap-4 px-4 py-2 rounded-[12px] border border-solid ${statusInfo.bgColor} ${statusInfo.borderColor}`}
          >
            <div className="flex justify-between gap-2 flex-1">
              <span className="font-normal text-neutral-black-80 text-sm tracking-[0] leading-[18px]">
                Estado del pedido:
              </span>
              <div
                className={`font-bold text-sm tracking-[0] leading-[18px] ${statusInfo.color}`}
              >
                {statusInfo.label}
              </div>
            </div>
          </div>

          {/* Fecha */}
          <p className="body-font text-gray-600">
            {new Date(order.createdAt).toLocaleDateString("es-CO", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>

          {/* Cancelar pedido */}
          {canCancel && (
            <Button
              variant="destructive"
              onClick={handleCancelOrder}
              className="w-full rounded-[30px]"
            >
              Cancelar Pedido
            </Button>
          )}

          {/* Datos del cliente */}
          {order.comment && (
            <>
              <p className="body-font font-bold">Comentario:</p>
              <Card className="gap-6 p-4 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
                <CardContent className="p-0">
                  <p className="body-font">{order.comment}</p>
                </CardContent>
              </Card>
            </>
          )}

          {/* Dirección de envío */}
          <p className="body-font font-bold">Direccion de envío:</p>
          <Card className="gap-6 p-4 w-full bg-accent-yellow-10 rounded-[12px] shadow-none border-0">
            <CardContent className="p-0">
              <div className="flex justify-between gap-6 w-full">
                <div className="flex gap-4">
                  <div className="flex flex-col gap-2">
                    <h5 className="body-font font-bold">
                      {order.deliveryAddress.name}
                    </h5>
                    <div className="body-font flex flex-col gap-1">
                      <span>
                        {order.deliveryAddress.city},{" "}
                        {order.deliveryAddress.country}
                      </span>
                      <span>{order.deliveryAddress.address}</span>
                      {order.deliveryAddress.floor && (
                        <span>{order.deliveryAddress.floor}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex">
                  <h2>${order.deliveryPrice.toLocaleString("es-CO")}</h2>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Columna derecha: Resumen del pedido */}
      <div className="flex flex-col items-start gap-8 max-w-[500px] w-full">
        <Card className="flex-col shadow-none bg-transparent! rounded-2xl flex items-start w-full border-0">
          <SpikesIcon className="w-full" />
          <CardContent className="p-0 w-full">
            <div className="px-6 py-2 bg-accent-yellow-10 flex flex-col items-start gap-8 w-full">
              <div className="inline-flex flex-col gap-4 items-start w-full">
                <h2 className="mt-[-1.00px]">RESUMEN DEL PEDIDO</h2>
              </div>

              {/* Items del pedido */}
              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-4 w-full">
                  {order.orderItems.map((item) => (
                    <OrderItemCard key={item.id} item={item} />
                  ))}
                </div>

                <Separator orientation="horizontal" className="w-full!" />
              </div>

              {/* Precios */}
              <div className="flex flex-col items-start gap-8 w-full">
                <div className="flex flex-col items-start gap-10 w-full rounded-xl">
                  <div className="flex flex-col items-start justify-end gap-4 w-full">
                    <div className="flex items-start gap-10 w-full">
                      <p className="flex-1 mt-[-0.93px] body-font">Subtotal</p>
                      <p className="w-fit mt-[-0.93px] body-font">
                        ${order.subtotal.toLocaleString("es-CO")}
                      </p>
                    </div>

                    <div className="flex items-start gap-10 w-full">
                      <p className="flex-1 mt-[-0.93px] body-font">Envío</p>
                      <p className="w-fit body-font font-bold">
                        ${order.deliveryPrice.toLocaleString("es-CO")}
                      </p>
                    </div>

                    <Separator orientation="horizontal" className="w-full!" />

                    <div className="flex items-center gap-10 w-full">
                      <p className="flex-1 body-font font-bold">Total</p>
                      <h2 className="w-fit mt-[-0.93px]">
                        ${order.totalPrice.toLocaleString("es-CO")}
                      </h2>
                    </div>

                    <Separator orientation="horizontal" className="w-full!" />

                    <div className="flex items-center gap-10 w-full">
                      <p className="flex-1 body-font font-bold">
                        Metodo de pago
                      </p>
                      <div className="flex items-center gap-2">
                        {CurrentPaymentIcon && (
                          <CurrentPaymentIcon className="w-6 h-6" />
                        )}
                        <h2 className="w-fit mt-[-0.93px]">
                          {paymentMethodLabel[order.paymentMethod] ||
                            order.paymentMethod}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
          <SpikesIcon className="w-full rotate-180" />
        </Card>
      </div>
    </div>
  );
}

function OrderItemCard({ item }: { item: OrderItemType }) {
  return (
    <Card className="flex w-full xl:h-28 items-start gap-4 pl-2 pr-3 xl:pr-4 py-2 bg-[#FFFFFF] rounded-[12px] overflow-hidden border-0">
      <CardContent className="p-0 flex w-full gap-4 items-center justify-start">
        <div className="w-24 h-24 min-w-24 bg-accent-yellow-40 rounded-[7.66px] relative">
          {item.image1 && (
            <Image
              src={item.image1}
              alt={item.name}
              width={67}
              height={105}
              className={`object-cover absolute ${item.image2
                  ? "left-[5px] top-[-5px]"
                  : "top-[-5px] left-[15px]"
                }`}
            />
          )}
          {item.image2 && (
            <Image
              src={item.image2}
              alt="Complemento"
              width={57}
              height={84}
              className="object-cover absolute top-5 left-[41px]"
            />
          )}
        </div>

        <div className="justify-center w-full max-w-[316px] gap-2 xl:gap-3 pt-1 pb-0 px-0 flex-1 grow flex flex-col items-start self-stretch">
          <div className="flex gap-3 self-stretch w-full rounded-[80.62px] flex-col items-start">
            <div className="gap-3 self-stretch w-full flex items-center">
              <div className="flex-1 font-h4">{item.name}</div>
            </div>
          </div>

          {/* Complementos de la orden */}
          {item.complements && item.complements.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {item.complements.map((comp, idx) => (
                <div
                  key={idx}
                  className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080] flex-shrink-0"
                >
                  <span className="text-neutrosblack-80 leading-[18px] font-normal text-[8px] sm:text-[9px] whitespace-nowrap font-[Montserrat,Helvetica]">
                    <span className="text-[#313131]">
                      {comp.quantity} {comp.name}
                    </span>
                    {comp.price > 0 && (
                      <span className="text-[#808080]">
                        {" "}
                        (+${comp.price.toLocaleString("es-CO")})
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Modificaciones */}
          {item.modifications && item.modifications.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {item.modifications.map((mod, idx) => (
                <div
                  key={idx}
                  className="inline-flex h-5 items-center justify-center gap-1 pl-1.5 pr-1 py-2 rounded-[30px] border border-solid border-[#808080] flex-shrink-0"
                >
                  <span className="text-[#313131] leading-[18px] font-normal text-[8px] sm:text-[9px] whitespace-nowrap">
                    {mod.text}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="flex h-8 items-center justify-between w-full rounded-[50px]">
            <h4>${item.price.toLocaleString("es-CO")}</h4>
            <h4>Cantidad: {item.quantity}</h4>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
