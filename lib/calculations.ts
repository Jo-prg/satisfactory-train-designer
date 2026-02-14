import type { Item } from '@/types';
import { getThroughputPerFreightCar, FLUID_CAR_MAX_THROUGHPUT, type BeltTier, type StackSize, type CarType } from './constants';

/**
 * Calculate the number of fluid cars needed
 * 
 * Fluids use pipes with a fixed max throughput of 896.52 m³/min per car
 * 
 * Formula: CEILING(required_flow_rate ÷ fluid_car_max_throughput)
 * 
 * @param requiredFlowRate - Required flow rate in m³/min
 * @returns Number of fluid cars needed (always >= 1)
 */
export function calculateFluidCars(requiredFlowRate: number): number {
  const fluidCars = requiredFlowRate / FLUID_CAR_MAX_THROUGHPUT;
  return Math.ceil(fluidCars);
}

/**
 * Calculate the number of freight cars needed using RATE-BASED MODEL
 * 
 * This is the primary calculation method. It uses wiki-tested throughput values
 * for freight cars at different belt tiers and stack sizes.
 * 
 * Formula: CEILING(required_items_per_minute ÷ throughput_per_freight_car)
 * 
 * @param requiredItemsPerMinute - Required throughput in items per minute
 * @param stackSize - Item stack size (50, 100, 200, or 500)
 * @param beltTier - Belt tier (mk5 or mk6)
 * @returns Number of freight cars needed (always >= 1)
 */
export function calculateFreightCarsRateBased(
  requiredItemsPerMinute: number,
  stackSize: StackSize,
  beltTier: BeltTier
): number {
  const throughputPerFreightCar = getThroughputPerFreightCar(beltTier, stackSize);
  const freightCars = requiredItemsPerMinute / throughputPerFreightCar;
  return Math.ceil(freightCars);
}

/**
 * Calculate freight cars based on car type
 * 
 * @param carType - Type of car (freight or fluid)
 * @param requiredItemsPerMinute - Required throughput (items/min or m³/min)
 * @param stackSize - Item stack size (only for freight cars)
 * @param beltTier - Belt tier (only for freight cars)
 * @returns Number of cars needed (always >= 1)
 */
export function calculateFreightCars(
  carType: CarType,
  requiredItemsPerMinute: number,
  stackSize?: StackSize,
  beltTier?: BeltTier
): number {
  if (carType === 'fluid') {
    return calculateFluidCars(requiredItemsPerMinute);
  }
  
  // For freight cars, stackSize and beltTier are required
  if (!stackSize || !beltTier) {
    throw new Error('Stack size and belt tier are required for freight cars');
  }
  
  return calculateFreightCarsRateBased(requiredItemsPerMinute, stackSize, beltTier);
}

/**
 * @deprecated Use calculateFreightCarsRateBased instead
 * 
 * Legacy capacity-based calculation (INCORRECT MODEL)
 * This assumes freight cars fill instantly, which is not how Satisfactory works.
 * Kept for backward compatibility during migration only.
 * 
 * Formula: CEILING(parts_per_train ÷ (32 × stack_size))
 * where parts_per_train = loop_time × (required_parts × 2)
 */
export function calculateFreightCarsLegacy(
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

// Re-export for convenience
export { getThroughputPerFreightCar } from './constants';
