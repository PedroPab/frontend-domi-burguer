import {  Kitchen } from '@/types/kitchens';


interface KitchenResponse {
  body: Kitchen[];
}

export class AddressService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async findKitchens(): Promise<KitchenResponse> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/kitchens`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error(`Error al cargar las cocinas: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error en findKitchenss:', error);
      throw error;
    }
  }
}