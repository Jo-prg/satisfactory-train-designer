'use client';

import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { calculateFreightCarsRateBased } from '@/lib/calculations';
import { generateItemId } from '@/lib/idGenerator';
import type { Item, ItemFormData } from '@/types';

/**
 * Custom hook for managing items with localStorage persistence
 */
export function useItems() {
  const [items, setItems] = useLocalStorage<Item[]>('satisfactory_train_items', []);

  const addItem = useCallback((data: ItemFormData) => {
    const freightCars = calculateFreightCarsRateBased(
      data.requiredParts,
      data.stackSize,
      data.beltTier
    );

    const newItem: Item = {
      id: generateItemId(),
      name: data.name,
      loopTime: data.loopTime,
      requiredParts: data.requiredParts,
      stackSize: data.stackSize,
      beltTier: data.beltTier,
      imageData: data.imageData,
      freightCars,
    };

    setItems((prev) => [...prev, newItem]);
    return newItem;
  }, [setItems]);

  const updateItem = useCallback((id: string, data: ItemFormData) => {
    const freightCars = calculateFreightCarsRateBased(
      data.requiredParts,
      data.stackSize,
      data.beltTier
    );

    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              name: data.name,
              loopTime: data.loopTime,
              requiredParts: data.requiredParts,
              stackSize: data.stackSize,
              beltTier: data.beltTier,
              imageData: data.imageData,
              freightCars,
            }
          : item
      )
    );
  }, [setItems]);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, [setItems]);

  const getItem = useCallback((id: string): Item | null => {
    return items.find((item) => item.id === id) || null;
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    deleteItem,
    getItem,
  };
}
