import { Address, Coordinates, PropertyType } from '@/types/address';

interface AddressFormData {
  address: string;
  floor: string;
  comment: string;
  city: string;
  country: string;
  propertyType: string;
  coordinates: Coordinates;
}

interface AddressResponse {
  body: Address;
}

export class AddressService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}api/v2/locations/public`;

  static async createAddress(data: AddressFormData): Promise<AddressResponse> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error al crear dirección: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createAddress:', error);
      throw error;
    }
  }
  
  static async createDeliveryPrice(addressId: string): Promise<any> {
    try {
      const response = await fetch(``, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al crear el precio del domicilio: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en createDeliveryPrice:', error);
      throw error;
    }
  }

  static parseAddress(fullAddress: string) {
    const parts = fullAddress.split(',').map(part => part.trim());
    return {
      street: parts[0] || '',
      city: parts[1] || '',
      country: parts[2] || '',
    };
  }
}