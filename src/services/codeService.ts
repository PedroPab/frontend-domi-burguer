import { ReferralCode } from '@/types/codes';

export class CodeService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async getUserCodes(token: string): Promise<{ body: ReferralCode[] }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/codes/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener los códigos');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user codes:', error);
      throw error;
    }
  }

  static async createCode(token: string): Promise<{ body: ReferralCode }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/codes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al crear el código');
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating code:', error);
      throw error;
    }
  }
}
