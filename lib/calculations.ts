import type { Item } from '@/types';

/**
 * Calculate the number of freight cars needed for given parameters
 * Formula: CEILING(parts_per_train ÷ (32 × stack_size))
 * where parts_per_train = loop_time × (required_parts × 2)
 */
export function calculateFreightCars(
  loopTime: number,
  requiredParts: number,
  stackSize: number
): number {
  const partsPerTrain = loopTime * (requiredParts * 2);
  const freightCars = partsPerTrain / (32 * stackSize);
  return Math.ceil(freightCars);
}

/**
 * Calculate the total number of freight cars across all items
 */
export function getTotalFreightCars(items: Item[]): number {
  return items.reduce((sum, item) => sum + item.freightCars, 0);
}
