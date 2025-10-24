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
  location: Location;
}