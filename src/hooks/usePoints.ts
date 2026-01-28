import { useState, useEffect } from 'react';
import { PointsSummary } from '@/types/points';
import { PointsService } from '@/services/pointsService';
import { useAuth } from '@/contexts/AuthContext';

export const usePoints = () => {
  const { user } = useAuth();
  const [points, setPoints] = useState<PointsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPoints = async () => {
    if (!user) {
      setPoints(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await PointsService.getUserPoints(token);
      setPoints(response.body);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los puntajes';
      setError(errorMessage);
      console.error('Error fetching points:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [user]);

  return {
    points,
    loading,
    error,
    refetch: fetchPoints,
  };
};
