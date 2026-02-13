import type { Item } from '@/types';

const STORAGE_KEY = 'satisfactory_train_items';

/**
 * Save items array to localStorage
 */
export function saveItems(items: Item[]): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    }
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
  }
}

/**
 * Load items array from localStorage
 */
export function loadItems(): Item[] {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    }
    return [];
  } catch (error) {
    console.error('Failed to load from localStorage:', error);
    return [];
  }
}
