import { UserProfile } from '@/types/user';

export class UserService {
  private static readonly API_URL = `${process.env.NEXT_PUBLIC_API_URL}`;

  static async getUserById(userId: string, token: string): Promise<{ body: UserProfile }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async getCurrentUser(token: string): Promise<{ body: UserProfile }> {
    try {
      const response = await fetch(`${this.API_URL}api/v2/users/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al obtener el usuario');
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching current user:', error);
      throw error;
    }
  }
}
