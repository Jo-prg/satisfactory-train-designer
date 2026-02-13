import { arrayMove } from './arrayUtils';

describe('arrayUtils', () => {
  describe('arrayMove', () => {
    it('should move an item forward in the array', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const result = arrayMove(arr, 1, 3);
      expect(result).toEqual(['a', 'c', 'd', 'b', 'e']);
      // Original array should not be modified
      expect(arr).toEqual(['a', 'b', 'c', 'd', 'e']);
    });

    it('should move an item backward in the array', () => {
      const arr = ['a', 'b', 'c', 'd', 'e'];
      const result = arrayMove(arr, 3, 1);
      expect(result).toEqual(['a', 'd', 'b', 'c', 'e']);
    });

    it('should handle moving to the same position', () => {
      const arr = ['a', 'b', 'c'];
      const result = arrayMove(arr, 1, 1);
      expect(result).toEqual(['a', 'b', 'c']);
    });

    it('should move first item to last position', () => {
      const arr = ['a', 'b', 'c'];
      const result = arrayMove(arr, 0, 2);
      expect(result).toEqual(['b', 'c', 'a']);
    });

    it('should move last item to first position', () => {
      const arr = ['a', 'b', 'c'];
      const result = arrayMove(arr, 2, 0);
      expect(result).toEqual(['c', 'a', 'b']);
    });

    it('should work with objects', () => {
      const arr = [
        { id: 1, name: 'first' },
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
      ];
      const result = arrayMove(arr, 0, 2);
      expect(result).toEqual([
        { id: 2, name: 'second' },
        { id: 3, name: 'third' },
        { id: 1, name: 'first' },
      ]);
    });

    it('should work with single item array', () => {
      const arr = ['a'];
      const result = arrayMove(arr, 0, 0);
      expect(result).toEqual(['a']);
    });

    it('should work with empty array', () => {
      const arr: string[] = [];
      const result = arrayMove(arr, 0, 0);
      expect(result).toEqual([]);
    });
  });
});
