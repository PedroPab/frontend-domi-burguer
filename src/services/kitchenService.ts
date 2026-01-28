import {  Kitchen } from '@/types/kitchens';
import { getApiUrl } from '@/lib/apiConfig';


interface KitchenResponse {
  body: Kitchen[];
}

export class AddressService {
  private static get API_URL() { return getApiUrl(); }

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