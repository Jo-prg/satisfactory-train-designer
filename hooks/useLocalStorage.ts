'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook to sync state with localStorage
 * Handles hydration by loading data only on client side
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  // Store initial value in a ref so it doesn't change on re-renders
  const initialValueRef = useRef(initialValue);
  
  // Initialize with initial value (will be used on server)
  const [storedValue, setStoredValue] = useState<T>(initialValue);

  // Load from localStorage after mount (client-side only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
      // Don't call setStoredValue if nothing in localStorage
      // The initial useState value will be used instead
    } catch (error) {
      console.error(`Error loading localStorage key "${key}":`, error);
    }
  }, [key]);

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      setStoredValue((prev) => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        // Save to localStorage immediately when user sets value
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
          console.error(`Error saving to localStorage for key "${key}":`, error);
        }
        return valueToStore;
      });
    } catch (error) {
      console.error(`Error setting value for key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}
