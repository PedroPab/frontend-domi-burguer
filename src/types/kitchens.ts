import { Location } from "./locations";
export type KitchenStatus = 'active' | 'inactive' | 'maintenance';

export interface FirebaseTimestamp {
  _seconds: number;
  _nanoseconds: number;
}

export interface Kitchen {
  id: string;
  name: string;
  locationId: string;
  status: KitchenStatus;
  phone: string;
  openingHours: string;
  createdAt: FirebaseTimestamp;
  updatedAt: FirebaseTimestamp;
  // location?: Location;
  coordinates: {
    lat: number | null;
    lng: number | null;
  };
  address: string;
  dailyOrders: number;
}

// id, name, locationId, address, coordinates, status, dailyOrders, phone, openingHours, createdAt, updatedAt