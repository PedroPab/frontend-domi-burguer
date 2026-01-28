import { PointsSummary } from '@/types/points';
import { getApiUrl } from '@/lib/apiConfig';

export class PointsService {
  private static get API_URL() { return getApiUrl(); }

  static async getUserPoints(token: string): Promise<{ body: PointsSummary }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/points`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los puntajes');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user points:', error);
      throw error;
    }
  }
}
