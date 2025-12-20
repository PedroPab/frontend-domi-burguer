import { useState } from 'react';
import { AddressService } from '@/services/addressService';
// import { AddressFormState } from './useAddressForm';
import { Address } from '@/types/address';
import { LocationService } from '@/services/locationService';
import { Kitchen } from '@/types/kitchens';
import { Delivery } from '@/types/orders';
import { Location } from '@/types/locations';

export const useAddressSubmit = (
  onSuccess: (data: { location: Location; address: Address; kitchen: Kitchen; delivery: Delivery }) => void,
  onError: (error: Error) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const submitAddress = async (locationData: object, token: string | null = null) : Promise<{location: Location , address: Address, kitchen: Kitchen, delivery: Delivery}> => {


    setIsSubmitting(true);
    setError(null);

    try { 
            
            const { body: location } = await LocationService.addLocation({ token, location: locationData });

            const { delivery, kitchen } = await AddressService.createDelivery(location.id);
      
      const address : Address = {
        ...location,
        fullAddress: location.address,
        deliveryPrice: delivery.price,
        distance: delivery.distance,
        // kitchen: kitchen
      };

      const data = { location, address, kitchen,  delivery };

      onSuccess(data);
      return data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la dirección';
      setError(errorMessage);
      onError(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }

  return {
    submitAddress,
    isSubmitting,
    error,
  };
};