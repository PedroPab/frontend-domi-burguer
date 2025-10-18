export type PropertyType = 'house' | 'building' | 'urbanization' | 'office';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  id: string;
  distance: number;
  name: string;
  address: string;
  floor?: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  comment?: string;
  propertyType: PropertyType | '';
  deliveryPrice?: number;
  kitchen?: string;
  fullAddress: string;
}

// Helper para crear dirección vacía
export const createEmptyAddress = (): Address => ({
  id: "",
  name: "",
  address: "",
  city: "",
  country: "",
  coordinates: {
    lng: 0,
    lat: 0,
  },
  propertyType: "",
  deliveryPrice: 0,
  fullAddress: "",
  kitchen: "",
  distance: 0,
});