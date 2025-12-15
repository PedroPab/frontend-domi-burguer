import { Order, OrderStatus } from '@/types/orders';

export class OrderService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async getUserOrders(token: string): Promise<{ body: Order[] }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/orders/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los pedidos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  static async getOrderById(orderId: string, token: string): Promise<{ body: Order }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching order:', error);
      throw error;
    }
  }

  static async cancelOrder(orderId: string, token: string): Promise<{ body: Order }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/orders/${orderId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al cancelar el pedido');
      }

      return await response.json();
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }

  static getOrderStatusInfo(status: OrderStatus) {
    const statusMap = {
      pending: {
        label: 'Pendiente',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      },
      confirmed: {
        label: 'Confirmado',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      },
      preparing: {
        label: 'En preparación',
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      },
      ready: {
        label: 'Listo para entrega',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      },
      delivering: {
        label: 'En reparto',
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200'
      },
      delivered: {
        label: 'Entregado',
        color: 'text-green-700',
        bgColor: 'bg-green-100',
        borderColor: 'border-green-300'
      },
      cancelled: {
        label: 'Cancelado',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    };

    return statusMap[status] || statusMap.pending;
  }
}
