import { renderHook, act } from '@testing-library/react';
import { useItems } from './useItems';
import type { ItemFormData } from '@/types';

describe('useItems', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  const mockItemData: ItemFormData = {
    name: 'Iron Ore',
    requiredParts: 100,
    stackSize: 100,
    beltTier: 'mk5',
    imageData: null,
  };

  it('should initialize with empty items array', () => {
    const { result } = renderHook(() => useItems());
    expect(result.current.items).toEqual([]);
  });

  it('should add an item', () => {
    const { result } = renderHook(() => useItems());

    act(() => {
      result.current.addItem(mockItemData);
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Iron Ore');
    // Mk.5, stack 100 = 1278 items/min per car
    // 100 / 1278 = 0.078 -> 1 car
    expect(result.current.items[0].freightCars).toBe(1);
  });

  it('should update an item', () => {
    const { result } = renderHook(() => useItems());

    let itemId: string = '';

    act(() => {
      const item = result.current.addItem(mockItemData);
      itemId = item.id;
    });

    act(() => {
      result.current.updateItem(itemId, {
        ...mockItemData,
        name: 'Copper Ore',
        requiredParts: 50,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Copper Ore');
    expect(result.current.items[0].requiredParts).toBe(50);
  });

  it('should delete an item', () => {
    const { result } = renderHook(() => useItems());

    let itemId: string = '';

    act(() => {
      const item = result.current.addItem(mockItemData);
      itemId = item.id;
    });

    expect(result.current.items).toHaveLength(1);

    act(() => {
      result.current.deleteItem(itemId);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it('should get an item by id', () => {
    const { result } = renderHook(() => useItems());

    let itemId: string = '';

    act(() => {
      const item = result.current.addItem(mockItemData);
      itemId = item.id;
    });

    const retrievedItem = result.current.getItem(itemId);
    expect(retrievedItem).not.toBeNull();
    expect(retrievedItem?.name).toBe('Iron Ore');
  });

  it('should return null for non-existent item', () => {
    const { result } = renderHook(() => useItems());

    const item = result.current.getItem('non-existent-id');
    expect(item).toBeNull();
  });

  it('should have stable callback references after changes', () => {
    const { result, rerender } = renderHook(() => useItems());

    const addItemRef1 = result.current.addItem;
    const updateItemRef1 = result.current.updateItem;
    const deleteItemRef1 = result.current.deleteItem;

    // Add an item to trigger state change
    act(() => {
      result.current.addItem(mockItemData);
    });

    // After state change, callbacks should still be stable due to useCallback
    expect(result.current.addItem).toBe(addItemRef1);
    expect(result.current.updateItem).toBe(updateItemRef1);
    expect(result.current.deleteItem).toBe(deleteItemRef1);
  });

  it('should recalculate freight cars when updating', () => {
    const { result } = renderHook(() => useItems());

    let itemId: string = '';

    act(() => {
      const item = result.current.addItem(mockItemData);
      itemId = item.id;
    });

    expect(result.current.items[0].freightCars).toBe(1);

    act(() => {
      result.current.updateItem(itemId, {
        ...mockItemData,
        requiredParts: 2000, // Higher throughput
      });
    });

    // Mk.5, stack 100 = 1278 items/min per car
    // 2000 / 1278 = 1.56 -> 2 cars
    expect(result.current.items[0].freightCars).toBe(2);
  });

  it('should persist items to localStorage', () => {
    const { result } = renderHook(() => useItems());

    act(() => {
      result.current.addItem(mockItemData);
    });

    // Check localStorage
    const stored = localStorage.getItem('satisfactory_train_items');
    expect(stored).toBeTruthy();
    
    const parsed = JSON.parse(stored!);
    expect(parsed).toHaveLength(1);
    expect(parsed[0].name).toBe('Iron Ore');
  });

  it('should load items from localStorage on mount', () => {
    // Pre-populate localStorage
    const existingItem = {
      id: 'test-id',
      name: 'Existing Item',
      requiredParts: 50,
      stackSize: 100,
      beltTier: 'mk5',
      imageData: null,
      freightCars: 1,
    };

    localStorage.setItem('satisfactory_train_items', JSON.stringify([existingItem]));

    const { result } = renderHook(() => useItems());

    // Should eventually load from localStorage
    expect(result.current.items.length).toBeGreaterThan(0);
  });

  it('should not cause infinite loops with multiple operations', () => {
    const { result, rerender } = renderHook(() => useItems());

    // Perform multiple operations separately to avoid batching issues
    act(() => {
      result.current.addItem(mockItemData);
    });
    
    act(() => {
      result.current.addItem({ ...mockItemData, name: 'Item 2' });
    });
    
    act(() => {
      result.current.addItem({ ...mockItemData, name: 'Item 3' });
    });

    expect(result.current.items).toHaveLength(3);

    // Rerender multiple times to check for infinite loops
    rerender();
    rerender();
    rerender();

    expect(result.current.items).toHaveLength(3);
  });
});
