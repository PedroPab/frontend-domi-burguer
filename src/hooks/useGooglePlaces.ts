import { useRef, useCallback } from 'react';
import { useLoadScript } from '@react-google-maps/api';

const libraries: 'places'[] = ['places'];

export const useGooglePlaces = (
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void
) => {
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
    libraries,
  });

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;
    
    const place = autocompleteRef.current.getPlace();
    
    if (place.geometry && place.geometry.location) {
      onPlaceSelected(place);
    }
  }, [onPlaceSelected]);

  return {
    isLoaded,
    onLoad,
    onPlaceChanged,
  };
};