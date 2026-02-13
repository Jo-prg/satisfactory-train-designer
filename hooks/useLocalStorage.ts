'use client';

import { useState, useEffect } from 'react';

/**
 * Custom hook to sync state with localStorage
 * Handles hydration by loading data only on client side
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Initialize with initial value (will be used on server)
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
    setIsHydrated(true);
  }, [key]);

  // Save to localStorage whenever value changes (after hydration)
  useEffect(() => {
    if (isHydrated) {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    }
  }, [key, storedValue, isHydrated]);

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
    } catch (error) {
      console.error(`Error setting value for key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}
