import { calculateFreightCars, getTotalFreightCars } from './calculations';
import type { Item } from '@/types';

describe('calculateFreightCars', () => {
  it('should calculate freight cars correctly and round up', () => {
    // Example from the original: Uranium with 600 parts/min, 5 min loop, 100 stack = 1.88 -> 2
    const result = calculateFreightCars(5, 600, 100);
    expect(result).toBe(2);
  });

  it('should return 0 for zero inputs', () => {
    expect(calculateFreightCars(0, 100, 50)).toBe(0);
    expect(calculateFreightCars(5, 0, 50)).toBe(0);
  });

  it('should round up fractional results', () => {
    // 1.1 should round to 2
    const result = calculateFreightCars(1, 35.2, 100);
    expect(result).toBe(1);
  });

  it('should handle small stack sizes', () => {
    const result = calculateFreightCars(5, 100, 1);
    expect(result).toBe(32); // (5 * 200) / 32 = 31.25 -> 32
  });

  it('should handle large stack sizes', () => {
    const result = calculateFreightCars(10, 50, 500);
    expect(result).toBe(1); // (10 * 100) / 16000 = 0.0625 -> 1
  });

  it('should use the correct formula', () => {
    const loopTime = 3;
    const requiredParts = 200;
    const stackSize = 50;
    
    // parts_per_train = 3 * (200 * 2) = 1200
    // freight_cars = 1200 / (32 * 50) = 1200 / 1600 = 0.75 -> 1
    expect(calculateFreightCars(loopTime, requiredParts, stackSize)).toBe(1);
  });
});

describe('getTotalFreightCars', () => {
  it('should sum freight cars from all items', () => {
    const items: Item[] = [
      {
        id: '1',
        name: 'Iron',
        loopTime: 5,
        requiredParts: 100,
        stackSize: 100,
        imageData: null,
        freightCars: 4,
      },
      {
        id: '2',
        name: 'Copper',
        loopTime: 3,
        requiredParts: 50,
        stackSize: 100,
        imageData: null,
        freightCars: 1,
      },
    ];

    expect(getTotalFreightCars(items)).toBe(5);
  });

  it('should return 0 for empty array', () => {
    expect(getTotalFreightCars([])).toBe(0);
  });

  it('should handle single item', () => {
    const items: Item[] = [
      {
        id: '1',
        name: 'Test',
        loopTime: 5,
        requiredParts: 100,
        stackSize: 100,
        imageData: null,
        freightCars: 3,
      },
    ];

    expect(getTotalFreightCars(items)).toBe(3);
  });
});
