import { useState, RefObject } from 'react';

export type PropertyType = 'house' | 'building' | 'urbanization' | 'office';

export interface AddressFormState {
  name: string;
  address: string;
  floor: string;
  comment: string;
  addressName: string;
  coordinates: { lat: number; lng: number } | null;
  selectedType: PropertyType | '';
}

export interface AddressFormErrors {
  address?: string;
  addressName?: string;
  floor?: string;
  coordinates?: string;
  comment?: string;
}

export interface AddressFormRefs {
  addressRef: RefObject<HTMLInputElement | null>;
  addressNameRef: RefObject<HTMLInputElement | null>;
  floorRef: RefObject<HTMLInputElement | null>;
  commentRef: RefObject<HTMLTextAreaElement | null>;
}

export const useAddressForm = (initialState?: Partial<AddressFormState>) => {
  const [formState, setFormState] = useState<AddressFormState>({
    name: initialState?.name || '',
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
      name: '',
      address: '',
      floor: '',
      comment: '',
      addressName: '',
      coordinates: null,
      selectedType: 'house',
    });
  };

  const [errors, setErrors] = useState<AddressFormErrors>({});

  const isFormValid = () => {
    return (
      formState.address !== '' &&
      // formState.addressName !== '' &&
      formState.selectedType !== '' &&
      formState.coordinates !== null &&
      formState.floor !== ''
    );
  };

  const validateAndFocus = (refs: AddressFormRefs): boolean => {
    const newErrors: AddressFormErrors = {};
    let firstErrorRef: RefObject<HTMLInputElement | HTMLTextAreaElement | null> | null = null;

    if (!formState.address || formState.address.trim() === '') {
      newErrors.address = 'Este campo es obligatorio';
      if (!firstErrorRef) firstErrorRef = refs.addressRef;
    }

    if (!formState.coordinates) {
      newErrors.coordinates = 'Debes seleccionar una ubicación válida del mapa';
      if (!firstErrorRef) firstErrorRef = refs.addressRef;
    }

    if (!formState.addressName || formState.addressName.trim() === '') {
      newErrors.addressName = 'Este campo es obligatorio';
      if (!firstErrorRef) firstErrorRef = refs.addressNameRef;
    } else if (formState.addressName.trim().length < 3) {
      newErrors.addressName = 'Debe tener al menos 3 caracteres';
      if (!firstErrorRef) firstErrorRef = refs.addressNameRef;
    }

    if (formState.comment && formState.comment.trim().length > 0 && formState.comment.trim().length < 3) {
      newErrors.comment = 'Debe tener al menos 3 caracteres';
      if (!firstErrorRef) firstErrorRef = refs.commentRef;
    }

    if (!formState.floor || formState.floor.trim() === '') {
      newErrors.floor = 'Este campo es obligatorio';
      if (!firstErrorRef) firstErrorRef = refs.floorRef;
    }

    setErrors(newErrors);

    if (firstErrorRef?.current) {
      firstErrorRef.current.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: keyof AddressFormErrors) => {
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return {
    formState,
    updateField,
    resetForm,
    isFormValid,
    errors,
    validateAndFocus,
    clearError,
  };
};