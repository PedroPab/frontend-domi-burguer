import { useState } from 'react';

export type PropertyType = 'house' | 'building' | 'urbanization' | 'office';

export interface AddressFormState {
  address: string;
  floor: string;
  comment: string;
  addressName: string;
  coordinates: { lat: number; lng: number } | null;
  selectedType: PropertyType | '';
}

export const useAddressForm = (initialState?: Partial<AddressFormState>) => {
  const [formState, setFormState] = useState<AddressFormState>({
    address: initialState?.address || '',
    floor: initialState?.floor || '',
    comment: initialState?.comment || '',
    addressName: initialState?.addressName || '',
    coordinates: initialState?.coordinates || null,
    selectedType: initialState?.selectedType || 'house',
  });

  const updateField = <K extends keyof AddressFormState>(
    field: K,
    value: AddressFormState[K]
  ) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  };

  const resetForm = () => {
    setFormState({
      address: '',
      floor: '',
      comment: '',
      addressName: '',
      coordinates: null,
      selectedType: '',
    });
  };

  const isFormValid = () => {
    return (
      formState.address !== '' &&
      // formState.addressName !== '' &&
      formState.selectedType !== '' &&
      formState.coordinates !== null &&
      formState.floor !== ''
    );
  };

  return {
    formState,
    updateField,
    resetForm,
    isFormValid,
  };
};