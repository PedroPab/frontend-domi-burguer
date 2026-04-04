import { PointsResponse } from '@/types/points';
import { getApiUrl } from '@/utils/apiUrl';

export class PointsService {
    private static get API_URL(): string {
        return getApiUrl();
    }

    static async getPointsByUserId(
        userId: string,
        token: string
    ): Promise<PointsResponse> {
        try {
            const response = await fetch(
                `${this.API_URL}api/v2/points/user/${userId}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error('Error al obtener los puntos del usuario');
            }

            return await response.json();
        } catch (error) {
            console.error('Error fetching user points:', error);
            throw error;
        }
    }
}
