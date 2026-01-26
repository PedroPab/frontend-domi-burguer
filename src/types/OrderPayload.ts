interface OrderPayload {
  name?: string;
  phone?: string;
  comment: string;
  locationId: string ;
  userId?: string | null;
  delivery: {
    price: number;
    distance: number;
  };
  orderItems: {
    id: string;
    quantity: number;
    complements: {
      id: string;
      quantity: number;
    }[];
  }[];
  paymentMethod: string;
  origin?: string;
}

export type { OrderPayload };