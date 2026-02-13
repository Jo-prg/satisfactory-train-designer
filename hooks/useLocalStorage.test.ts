import { renderHook, act, waitFor } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should load value from localStorage on mount', async () => {
    localStorage.setItem('test-key', JSON.stringify('stored-value'));
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'default'));
    
    // Should eventually load the stored value
    await waitFor(() => {
      expect(result.current[0]).toBe('stored-value');
    });
  });

  it('should save value to localStorage when updated', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });

    await waitFor(() => {
      expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new-value'));
    });
  });

  it('should handle function updates', async () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 5));

    act(() => {
      result.current[1]((prev) => prev + 1);
    });

    await waitFor(() => {
      expect(result.current[0]).toBe(6);
    });
  });

  it('should handle arrays without causing infinite loops', async () => {
    const { result, rerender } = renderHook(() => useLocalStorage('test-array', [] as number[]));
    
    // Add item
    act(() => {
      result.current[1]([1, 2, 3]);
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual([1, 2, 3]);
    });

    // Rerender multiple times to check for infinite loops
    rerender();
    rerender();
    rerender();

    expect(result.current[0]).toEqual([1, 2, 3]);
  });

  it('should handle objects without causing infinite loops', async () => {
    const { result, rerender } = renderHook(() => 
      useLocalStorage('test-obj', {} as Record<string, number>)
    );
    
    act(() => {
      result.current[1]({ a: 1, b: 2 });
    });

    await waitFor(() => {
      expect(result.current[0]).toEqual({ a: 1, b: 2 });
    });

    // Rerender multiple times to check for infinite loops
    rerender();
    rerender();
    rerender();

    expect(result.current[0]).toEqual({ a: 1, b: 2 });
  });

  it('should handle key changes without causing infinite loops', async () => {
    localStorage.setItem('key1', JSON.stringify('value1'));
    localStorage.setItem('key2', JSON.stringify('value2'));
    
    let key = 'key1';
    const { result, rerender } = renderHook(() => useLocalStorage(key, 'default'));

    await waitFor(() => {
      expect(result.current[0]).toBe('value1');
    });

    // Change key
    key = 'key2';
    rerender();

    // Should load the new key's value without infinite loops
    await waitFor(() => {
      expect(result.current[0]).toBe('value2');
    });
  });

  it('should handle localStorage errors gracefully', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    
    // Mock localStorage.setItem to throw
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('Storage quota exceeded');
    });

    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'));
    
    act(() => {
      result.current[1]('new-value');
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    
    consoleErrorSpy.mockRestore();
  });

  it('should not write to localStorage before hydration', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
    
    renderHook(() => useLocalStorage('test-key', 'initial'));
    
    // Should not have written yet (before hydration)
    expect(setItemSpy).not.toHaveBeenCalledWith('test-key', JSON.stringify('initial'));
    
    setItemSpy.mockRestore();
  });
});
