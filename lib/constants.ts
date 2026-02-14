/**
 * Constants for train throughput calculations
 * 
 * RATE-BASED MODEL:
 * In Satisfactory, trains are rate-limited by station loading/unloading speed,
 * which is constrained by belt throughput, NOT just cargo capacity.
 * 
 * This file contains wiki-tested throughput values for freight cars at different
 * belt tiers and stack sizes.
 */

/**
 * Number of inventory slots per freight car in Satisfactory
 */
export const FREIGHT_CAR_CAPACITY = 32;

/**
 * Maximum throughput for a fluid freight car (m³/min)
 * Fluid cars use pipes and have a fixed throughput regardless of other factors
 */
export const FLUID_CAR_MAX_THROUGHPUT = 896.52;

/**
 * Car type - freight or fluid
 */
export type CarType = 'freight' | 'fluid';

/**
 * Belt tier type - Mk.5 or Mk.6 conveyor belts
 */
export type BeltTier = 'mk5' | 'mk6';

/**
 * Supported stack sizes based on wiki-tested throughput data
 * These are the standard stack sizes in Satisfactory
 */
export const SUPPORTED_STACK_SIZES = [50, 100, 200, 500] as const;

/**
 * Stack size type - constrained to supported values
 */
export type StackSize = typeof SUPPORTED_STACK_SIZES[number];

/**
 * Belt throughput table for freight cars (items per minute)
 * 
 * Values are wiki-tested for a single freight car being loaded/unloaded
 * at a train station with the specified belt tier and item stack size.
 * 
 * Key format: "{beltTier}-{stackSize}"
 * Value: throughput in items per minute per freight car
 */
export const BELT_THROUGHPUT_TABLE: Record<string, number> = {
  // Mk.5 belt throughput values
  'mk5-50': 1083,
  'mk5-100': 1278,
  'mk5-200': 1405,
  'mk5-500': 1494,
  
  // Mk.6 belt throughput values
  'mk6-50': 1431,
  'mk6-100': 1793,
  'mk6-200': 2052,
  'mk6-500': 2247,
};

/**
 * Get the throughput key for the belt throughput table
 */
export function getBeltThroughputKey(beltTier: BeltTier, stackSize: StackSize): string {
  return `${beltTier}-${stackSize}`;
}

/**
 * Get the throughput per freight car for given belt tier and stack size
 * 
 * @param beltTier - The belt tier (mk5 or mk6)
 * @param stackSize - The item stack size (50, 100, 200, or 500)
 * @returns Throughput in items per minute per freight car
 * @throws Error if the combination is not supported
 */
export function getThroughputPerFreightCar(beltTier: BeltTier, stackSize: StackSize): number {
  const key = getBeltThroughputKey(beltTier, stackSize);
  const throughput = BELT_THROUGHPUT_TABLE[key];
  
  if (throughput === undefined) {
    throw new Error(`Unsupported belt tier/stack size combination: ${beltTier} with stack size ${stackSize}`);
  }
  
  return throughput;
}
