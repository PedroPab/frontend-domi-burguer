import { useCallback, useEffect } from 'react';
import { useCartStore } from '@/store/cartStore';
import { useCartModalItemDeleteStore } from '@/store/cartModalItemDeleteStore';
import { useAppliedCodeStore } from '@/store/appliedCodeStore';
import { Code } from '@/types/codes';
import { Complement } from '@/types/products';
import { generateCartItemId, calculateTotalPrice } from '@/lib/utils';

export const useCartActions = () => {
  const {
    items,
    updateQuantity,
    removeComplement,
    addItem,
  } = useCartStore();

  const {
    itemToDelete,
    isDeleteModalOpen,
    openDeleteModal,
    closeDeleteModal,
  } = useCartModalItemDeleteStore();

  const { appliedCode, isRewardApplied } = useAppliedCodeStore();

  const handleIncrease = (id: string, quantity: number) => {
    updateQuantity(id, quantity + 1);
  };

  const handleDecrease = (id: string, quantity: number) => {
    if (quantity === 1) {
      const item = items.find((item) => item.id === id);
      if (item) {
        openDeleteModal({ id: item.id, name: item.name });
      }
    } else {
      updateQuantity(id, quantity - 1);
    }
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      updateQuantity(itemToDelete.id, 0);
      closeDeleteModal();
    }
  };

  const handleCloseDeleteModal = () => {
    closeDeleteModal();
  };

  const addCodeInItems = useCallback((appliedCoupon: Code) => {
    // Solo manejamos códigos de referidos por ahora
    if (appliedCoupon.type !== 'referral') return;

    const rewardElement = appliedCoupon.reward?.elements[0];
    if (!rewardElement) return;
    console.log('Procesando código de referido, reward element:', rewardElement);

    // Solo manejamos rewards de tipo complement
    if (appliedCoupon.reward?.typeAddReward !== 'complement') return;

    // Obtener items actuales del store directamente
    const currentItems = useCartStore.getState().items;
    console.log('Items actuales en el carrito:', currentItems);

    // Verificamos que hay items en el carrito
    if (currentItems.length === 0) {
      console.log('No hay items en el carrito, el reward se aplicará cuando se agregue un producto');
      // Marcar que el reward NO está aplicado para que se aplique cuando haya productos
      useAppliedCodeStore.getState().setRewardApplied(false);
      return;
    }

    // Verificar si ya existe el complemento en algún item del carrito
    const alreadyHasComplement = currentItems.some((item) =>
      item.complements.some((c) => c.rewardCode === appliedCoupon.code)
    );

    if (alreadyHasComplement) {
      console.log('El complemento de referido ya existe en algún item, no se agrega de nuevo.');
      useAppliedCodeStore.getState().setRewardApplied(true);
      return;
    }

    const firstItem = currentItems[0];
    console.log('Primer item del carrito:', firstItem);

    // Crear el complemento con los datos del reward
    const newComplement: Complement = {
      id: rewardElement.id,
      name: rewardElement.note || `Complemento gratis (${appliedCoupon.code})`,
      quantity: rewardElement.quantity || 1,
      price: rewardElement.price,
      type: 'special',
      minusComplement: false,
      rewardCode: appliedCoupon.code,
    };
    console.log('Agregando complemento de referido:', newComplement);

    // Si el primer item tiene más de 1 unidad, separamos
    if (firstItem.quantity > 1) {
      console.log('Item tiene cantidad > 1, separando una unidad para aplicar el código');

      // Restar 1 unidad al item original
      useCartStore.getState().updateQuantity(firstItem.id, firstItem.quantity - 1);

      // Crear nuevo item con 1 unidad y el complemento de referido
      const newComplements = [...firstItem.complements, newComplement];
      const newItemId = generateCartItemId(firstItem.productId, newComplements);
      const newPrice = calculateTotalPrice(firstItem.basePrice, newComplements);

      const newItem = {
        ...firstItem,
        id: newItemId,
        quantity: 1,
        complements: newComplements,
        price: newPrice,
      };

      console.log('Agregando nuevo item separado con código:', newItem);
      useCartStore.getState().addItem(newItem);
    } else {
      // Si solo tiene 1 unidad, aplicamos el complemento directamente
      console.log('Item tiene cantidad = 1, aplicando código directamente');
      const updatedComplements = [...firstItem.complements, newComplement];
      useCartStore.getState().updateItemComplements(firstItem.id, updatedComplements);
    }

    // Marcar que el reward ya fue aplicado
    useAppliedCodeStore.getState().setRewardApplied(true);
  }, []);

  const removeCodeFromItems = useCallback((appliedCoupon: Code) => {
    // Solo manejamos códigos de referidos
    if (appliedCoupon.type !== 'referral') return;

    if (appliedCoupon.reward?.typeAddReward !== 'complement') return;

    console.log('Removiendo complemento de referido con código:', appliedCoupon.code);

    // Obtener items actuales del store directamente
    const currentItems = useCartStore.getState().items;

    // Buscar el item que tiene el complemento con este rewardCode
    for (const item of currentItems) {
      const hasReferralComplement = item.complements.some(
        (c) => c.rewardCode === appliedCoupon.code
      );

      if (hasReferralComplement) {
        // Remover el complemento del item filtrando por rewardCode
        const updatedComplements = item.complements.filter(
          (c) => c.rewardCode !== appliedCoupon.code
        );
        useCartStore.getState().updateItemComplements(item.id, updatedComplements);
        break;
      }
    }

    // Marcar que el reward ya no está aplicado
    useAppliedCodeStore.getState().setRewardApplied(false);
  }, []);

  // Función para verificar si el reward del código sigue aplicado en el carrito
  const checkAndReapplyReward = useCallback(() => {
    const { appliedCode } = useAppliedCodeStore.getState();

    // Si no hay código aplicado, no hay nada que hacer
    if (!appliedCode || appliedCode.type !== 'referral') return;
    if (appliedCode.reward?.typeAddReward !== 'complement') return;

    const currentItems = useCartStore.getState().items;

    // Si no hay items, marcar que el reward no está aplicado
    if (currentItems.length === 0) {
      useAppliedCodeStore.getState().setRewardApplied(false);
      return;
    }

    // Verificar si el reward sigue en algún item
    const rewardStillExists = currentItems.some((item) =>
      item.complements.some((c) => c.rewardCode === appliedCode.code)
    );

    if (!rewardStillExists) {
      console.log('El reward del código se perdió, re-aplicándolo al primer item disponible');
      // Re-aplicar el reward
      addCodeInItems(appliedCode);
    }
  }, [addCodeInItems]);

  // Efecto para detectar cambios en los items y re-aplicar el reward si se perdió
  useEffect(() => {
    // Solo verificar si hay un código aplicado
    if (!appliedCode) return;

    // Usar setTimeout para asegurar que el estado del store esté actualizado
    // después de cualquier operación de eliminación/modificación
    const timeoutId = setTimeout(() => {
      const currentItems = useCartStore.getState().items;

      if (currentItems.length === 0) {
        // No hay items, marcar que el reward no está aplicado
        useAppliedCodeStore.getState().setRewardApplied(false);
        return;
      }

      const rewardExists = currentItems.some((item) =>
        item.complements.some((c) => c.rewardCode === appliedCode.code)
      );

      if (!rewardExists) {
        console.log('El reward se perdió o no existe, re-aplicándolo al primer item disponible...');
        // La función addCodeInItems ya maneja la separación de items con quantity > 1
        addCodeInItems(appliedCode);
      }
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [items, appliedCode, addCodeInItems]);

  return {
    items,
    handleIncrease,
    handleDecrease,
    handleConfirmDelete,
    handleCloseDeleteModal,
    removeComplement,
    addItem,
    itemToDelete,
    isDeleteModalOpen,
    addCodeInItems,
    removeCodeFromItems,
    checkAndReapplyReward,
  };
};
