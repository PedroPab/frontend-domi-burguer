import { create } from "zustand";

interface CheckoutFormData {
  name: string;
  phone: string;
  comment: string;
  paymentMethod: string;
}

interface CheckoutFormStore {
  formData: CheckoutFormData;
  error: string | null;
  setFormField: <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => void;
  setFormData: (data: Partial<CheckoutFormData>) => void;
  setError: (error: string | null) => void;
  resetForm: () => void;
}

const initialFormData: CheckoutFormData = {
  name: "",
  phone: "",
  comment: "",
  paymentMethod: "cash",
};

export const useCheckoutFormStore = create<CheckoutFormStore>()((set) => ({
  formData: initialFormData,
  error: null,

  setFormField: (field, value) =>
    set((state) => ({
      formData: { ...state.formData, [field]: value },
      error: null,
    })),

  setFormData: (data) =>
    set((state) => ({
      formData: { ...state.formData, ...data },
    })),

  setError: (error) => set({ error }),

  resetForm: () => set({ formData: initialFormData, error: null }),
}));
