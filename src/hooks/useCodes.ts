import { useState, useEffect } from 'react';
import { ReferralCode } from '@/types/codes';
import { CodeService } from '@/services/codeService';
import { useAuth } from '@/contexts/AuthContext';

export const useCodes = () => {
  const { user } = useAuth();
  const [codes, setCodes] = useState<ReferralCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCodes = async () => {
    if (!user) {
      setCodes([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await CodeService.getUserCodes(token);
      setCodes(response.body || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar los códigos';
      setError(errorMessage);
      console.error('Error fetching codes:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCode = async () => {
    if (!user) throw new Error('Usuario no autenticado');

    const token = await user.getIdToken();
    const response = await CodeService.createCode(token);
    setCodes(prev => [...prev, response.body]);
    return response.body;
  };

  useEffect(() => {
    fetchCodes();
  }, [user]);

  return {
    codes,
    loading,
    error,
    createCode,
    refetch: fetchCodes,
  };
};
