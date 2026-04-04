import { useState, useEffect, useCallback } from 'react';
import { Point } from '@/types/points';
import { PointsService } from '@/services/pointsService';
import { useAuth } from '@/contexts/AuthContext';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useUserPoints = () => {
    const { user } = useAuth();
    const { userProfile } = useUserProfile();
    const [points, setPoints] = useState<Point[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPoints = useCallback(async () => {
        if (!user || !userProfile?.id) {
            setPoints([]);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const token = await user.getIdToken();
            const response = await PointsService.getPointsByUserId(
                userProfile.id,
                token
            );
            setPoints(response.body);
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Error al cargar los puntos';
            setError(errorMessage);
            console.error('Error fetching user points:', err);
        } finally {
            setLoading(false);
        }
    }, [user, userProfile?.id]);

    useEffect(() => {
        if (userProfile?.id) {
            fetchPoints();
        }
    }, [userProfile?.id, fetchPoints]);

    return {
        points,
        loading,
        error,
        refetch: fetchPoints,
    };
};
