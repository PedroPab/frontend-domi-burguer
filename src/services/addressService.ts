import { Address, Coordinates } from '@/types/address';
import { Kitchen } from '@/types/kitchens';
import { Delivery } from '@/types/orders';

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
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async createAddress(data: AddressFormData): Promise<AddressResponse> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/locations/public`, {
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
  
  static async createDelivery(addressId: string): Promise<{ delivery: Delivery; kitchen: Kitchen }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/kitchens/selectKitchen/location?locationId=${addressId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Error al crear el precio del domicilio: ${response.statusText}`);
      }

      const data =  await response.json();
      const delivery =  data.body.delivery as Delivery
      const kitchen = data.body.kitchen as Kitchen
      console.log('Respuesta de createDelivery:', {delivery, kitchen});
      return {  delivery, kitchen  };
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