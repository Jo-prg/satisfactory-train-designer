'use client';

import { useState, useCallback } from 'react';
import type { ModalState } from '@/types';

/**
 * Custom hook for managing modal state
 */
export function useModal() {
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mode: 'add',
    editingItemId: null,
  });

  const open = useCallback((mode: 'add' | 'edit', itemId: string | null = null) => {
    setModalState({
      isOpen: true,
      mode,
      editingItemId: itemId,
    });
  }, []);

  const close = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      editingItemId: null,
    });
  }, []);

  const reset = useCallback(() => {
    setModalState({
      isOpen: false,
      mode: 'add',
      editingItemId: null,
    });
  }, []);

  return {
    ...modalState,
    open,
    close,
    reset,
  };
}
