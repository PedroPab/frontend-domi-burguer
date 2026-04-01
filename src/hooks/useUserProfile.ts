import { useState, useEffect } from 'react';
import { UserProfile } from '@/types/user';
import { UserService } from '@/services/userService';
import { useAuth } from '@/contexts/AuthContext';

export const useUserProfile = () => {
  const { user } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserProfile = async () => {
    if (!user) {
      setUserProfile(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const token = await user.getIdToken();
      const response = await UserService.getCurrentUser(token);
      setUserProfile(response.body);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar el perfil';
      setError(errorMessage);
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    fetchUserProfile();
  };

  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  return {
    userProfile,
    loading,
    error,
    refreshProfile,
    refetch: fetchUserProfile
  };
};
