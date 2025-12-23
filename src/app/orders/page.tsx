"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useOrders } from "@/hooks/useOrders";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, Calendar, MapPin, User, Phone, Package, X } from "lucide-react";
import { Order } from "@/types/orders";
import { OrderService } from "@/services/orderService";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
    const { orders, loading, error, cancelOrder } = useOrders();
    const { user } = useAuth();
    const router = useRouter();

    const handleCancelOrder = async (orderId: string) => {
        try {
            await cancelOrder(orderId);
        } catch (error) {
            console.error('Error cancelling order:', error);
        }
    };

    const handleViewOrder = (orderId: string) => {
        router.push(`/orders/${orderId}`);
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-[130px]">
                <Card className="w-full max-w-md p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4">Inicia sesión</h1>
                    <p className="text-gray-600 mb-6">
                        Debes iniciar sesión para ver tus pedidos
                    </p>
                    <Button onClick={() => router.push('/login')} className="w-full">
                        Iniciar Sesión
                    </Button>
                </Card>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-[130px]">
                <div className="text-center">
                    <Loader2 className="animate-spin h-8 w-8 mx-auto mb-4" />
                    <p className="text-gray-600">Cargando tus pedidos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 mt-[130px]">
                <Card className="w-full max-w-md p-8 text-center">
                    <h1 className="text-2xl font-bold mb-4 text-red-600">Error</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <Button onClick={() => window.location.reload()} className="w-full">
                        Reintentar
                    </Button>
                </Card>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 mt-[130px]">
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>
                    <Card className="p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                        <h2 className="text-xl font-semibold mb-2">No tienes pedidos aún</h2>
                        <p className="text-gray-600 mb-6">
                            Cuando realices tu primer pedido, aparecerá aquí
                        </p>
                        <Button onClick={() => router.push('/')} className="w-full max-w-xs">
                            Hacer un Pedido
                        </Button>
                    </Card>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mt-[130px]">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <h1 className="text-3xl font-bold mb-8">Mis Pedidos</h1>

                <div className="space-y-6">
                    {orders.map((order) => (
                        <OrderCard
                            key={order.id}
                            order={order}
                            onCancel={() => handleCancelOrder(order.id)}
                            onView={() => handleViewOrder(order.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

interface OrderCardProps {
    order: Order;
    onCancel: () => void;
    onView: () => void;
}

function OrderCard({ order, onCancel, onView }: OrderCardProps) {
    const statusInfo = OrderService.getOrderStatusInfo(order.status);
    const canCancel = ['pending', 'confirmed'].includes(order.status);
    console.log("Rendering OrderCard for order:", order);
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="font-semibold text-lg">Pedido #{order.orderNumber}</h3>
                        <p className="text-gray-600 text-sm">
                            {new Date(order.createdAt).toLocaleDateString('es-CO', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusInfo.bgColor} ${statusInfo.color} ${statusInfo.borderColor} border`}>
                        {statusInfo.label}
                    </div>
                </div>

                <div className="space-y-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="w-4 h-4" />
                        {/* <span>{order.customerInfo.name}</span> */}
                    </div>



                </div>

                <div className="border-t pt-4">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-sm text-gray-600">
                            {order.orderItems.length} {order.orderItems.length === 1 ? 'producto' : 'productos'}
                        </span>
                        <span className="font-semibold text-lg">
                            ${order.totalPrice.toLocaleString('es-CO')}
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={onView}
                            className="flex-1"
                        >
                            Ver Detalles
                        </Button>

                        {canCancel && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={onCancel}
                                className="flex items-center gap-1"
                            >
                                <X className="w-4 h-4" />
                                Cancelar
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
