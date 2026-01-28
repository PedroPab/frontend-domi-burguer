import { PointsSummary } from '@/types/points';

export class PointsService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

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
