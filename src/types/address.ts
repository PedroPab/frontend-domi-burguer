export type PropertyType = 'house' | 'building' | 'urbanization' | 'office';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Address {
  id?: string;
  name: string;
  address: string;
  floor?: string;
  city: string;
  country: string;
  coordinates: Coordinates;
  comment?: string;
  propertyType: PropertyType | '';
}

// Helper para crear dirección vacía
export const createEmptyAddress = (): Address => ({
  name: "",
  address: "",
  city: "",
  country: "",
  coordinates: {
    lng: 0,
    lat: 0,
  },
  propertyType: "",
});