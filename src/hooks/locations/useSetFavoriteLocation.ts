import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { LocationService } from "@/services/locationService";
import { Location } from "@/types/locations";
import { getIdToken } from "firebase/auth";

interface UseSetFavoriteLocationProps {
  locations: Location[];
  setLocations: React.Dispatch<React.SetStateAction<Location[]>>;
}

export const useSetFavoriteLocation = ({ locations, setLocations }: UseSetFavoriteLocationProps) => {
  const { user } = useAuth();
  const [isSettingFavorite, setIsSettingFavorite] = useState(false);

  const setFavorite = async (locationId: string) => {
    if (!user) return;
    const previousLocations = [...locations];
    setIsSettingFavorite(true);
    try {
      setLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          favorite: loc.id === locationId,
        }))
      );
      const token = await getIdToken(user);
      await LocationService.setFavorite({ token, id: locationId });
    } catch (err) {
      console.error("Error marcando dirección como favorita", err);
      setLocations(previousLocations);
    } finally {
      setIsSettingFavorite(false);
    }
  };

  return { setFavorite, isSettingFavorite };
};
