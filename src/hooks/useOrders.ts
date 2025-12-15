import { useState, useEffect } from 'react';
import { Order } from '@/types/orders';
import { OrderService } from '@/services/orderService';
import { useAuth } from '@/contexts/AuthContext';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const token = await user.getIdToken();
      const response = await OrderService.getUserOrders(token);
      setOrders(response.body || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los pedidos';
      setError(errorMessage);
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const token = await user.getIdToken();
      const response = await OrderService.cancelOrder(orderId, token);
      
      // Update the order in the local state
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? response.body : order
        )
      );
      
      return response.body;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cancelar el pedido';
      throw new Error(errorMessage);
    }
  };

  const refreshOrders = () => {
    fetchOrders();
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  return {
    orders,
    loading,
    error,
    cancelOrder,
    refreshOrders,
    refetch: fetchOrders
  };
};
