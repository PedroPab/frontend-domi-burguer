import { useState } from 'react';
import { AddressService } from '@/services/addressService';
import { AddressFormState } from './useAddressForm';
import { Address } from '@/types/address';

export const useAddressSubmit = (
  onSuccess?: (address: Address) => void,
  onError?: (error: Error) => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitAddress = async (formState: AddressFormState) => {
    if (!formState.coordinates) {
      setError('Las coordenadas son requeridas');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { street, city, country } = AddressService.parseAddress(formState.address);

      const formData = {
        address: formState.address,
        floor: formState.floor,
        comment: formState.comment || 'sin comentarios',
        city,
        country,
        propertyType: formState.selectedType,
        coordinates: formState.coordinates,
      };

      const response = await AddressService.createAddress(formData);
      const responseDelivery = await AddressService.createDelivery(response.body.id || '');
      console.log('Respuesta de createDelivery:', responseDelivery);

      const addressData = {
        ...response.body,
        address: street,
        name: formState.addressName,
        deliveryPrice: responseDelivery.body.delivery.price || 0,
        kitchen: responseDelivery.body.kitchen.name || '',
      };

      onSuccess?.(addressData);
      return addressData;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear la dirección';
      setError(errorMessage);
      onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submitAddress,
    isSubmitting,
    error,
  };
};