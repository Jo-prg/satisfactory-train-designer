/**
 * Utility functions for array manipulation
 */

/**
 * Moves an item in an array from one index to another
 * @param array - The array to modify
 * @param from - The index to move from
 * @param to - The index to move to
 * @returns A new array with the item moved
 */
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}
