import { calculateFreightCarsRateBased, calculateFreightCarsLegacy, getTotalFreightCars, getThroughputPerFreightCar } from './calculations';
import type { Item } from '@/types';

describe('calculateFreightCarsRateBased', () => {
  describe('Mk.5 belt calculations', () => {
    it('should calculate 1 freight car when exactly at throughput for stack 50', () => {
      // Mk.5, stack 50 = 1083 items/min per car
      const result = calculateFreightCarsRateBased(1083, 50, 'mk5');
      expect(result).toBe(1);
    });

    it('should calculate 2 freight cars when slightly over throughput for stack 100', () => {
      // Mk.5, stack 100 = 1278 items/min per car
      // 2000 / 1278 = 1.56 -> 2 cars
      const result = calculateFreightCarsRateBased(2000, 100, 'mk5');
      expect(result).toBe(2);
    });

    it('should calculate freight cars for stack 200', () => {
      // Mk.5, stack 200 = 1405 items/min per car
      // 3000 / 1405 = 2.14 -> 3 cars
      const result = calculateFreightCarsRateBased(3000, 200, 'mk5');
      expect(result).toBe(3);
    });

    it('should calculate freight cars for stack 500', () => {
      // Mk.5, stack 500 = 1494 items/min per car
      // 1500 / 1494 = 1.00 -> 1 car
      const result = calculateFreightCarsRateBased(1500, 500, 'mk5');
      expect(result).toBe(2);
    });
  });

  describe('Mk.6 belt calculations', () => {
    it('should calculate 1 freight car when exactly at throughput for stack 50', () => {
      // Mk.6, stack 50 = 1431 items/min per car
      const result = calculateFreightCarsRateBased(1431, 50, 'mk6');
      expect(result).toBe(1);
    });

    it('should calculate freight cars for stack 100', () => {
      // Mk.6, stack 100 = 1793 items/min per car
      // 3000 / 1793 = 1.67 -> 2 cars
      const result = calculateFreightCarsRateBased(3000, 100, 'mk6');
      expect(result).toBe(2);
    });

    it('should calculate freight cars for stack 200', () => {
      // Mk.6, stack 200 = 2052 items/min per car
      // 2052 / 2052 = 1 -> 1 car (exact match)
      const result = calculateFreightCarsRateBased(2052, 200, 'mk6');
      expect(result).toBe(1);
    });

    it('should calculate freight cars for stack 500', () => {
      // Mk.6, stack 500 = 2247 items/min per car
      // 5000 / 2247 = 2.23 -> 3 cars
      const result = calculateFreightCarsRateBased(5000, 500, 'mk6');
      expect(result).toBe(3);
    });
  });

  describe('edge cases', () => {
    it('should always return at least 1 freight car for any positive throughput', () => {
      // Very low throughput should still give 1 car
      const result = calculateFreightCarsRateBased(1, 100, 'mk5');
      expect(result).toBe(1);
    });

    it('should handle very high throughput requirements', () => {
      // Mk.6, stack 500 = 2247 items/min per car
      // 10000 / 2247 = 4.45 -> 5 cars
      const result = calculateFreightCarsRateBased(10000, 500, 'mk6');
      expect(result).toBe(5);
    });

    it('should handle fractional items per minute', () => {
      // Mk.5, stack 100 = 1278 items/min per car
      // 1500.5 / 1278 = 1.17 -> 2 cars
      const result = calculateFreightCarsRateBased(1500.5, 100, 'mk5');
      expect(result).toBe(2);
    });
  });

  describe('realistic example scenarios', () => {
    it('should calculate for typical uranium setup (600 parts/min, Mk.5, stack 100)', () => {
      // Mk.5, stack 100 = 1278 items/min per car
      // 600 / 1278 = 0.47 -> 1 car
      const result = calculateFreightCarsRateBased(600, 100, 'mk5');
      expect(result).toBe(1);
    });

    it('should calculate for high-throughput iron ore (2000 parts/min, Mk.6, stack 200)', () => {
      // Mk.6, stack 200 = 2052 items/min per car
      // 2000 / 2052 = 0.97 -> 1 car
      const result = calculateFreightCarsRateBased(2000, 200, 'mk6');
      expect(result).toBe(1);
    });
  });
});

describe('getThroughputPerFreightCar', () => {
  it('should return correct throughput values for all Mk.5 configurations', () => {
    expect(getThroughputPerFreightCar('mk5', 50)).toBe(1083);
    expect(getThroughputPerFreightCar('mk5', 100)).toBe(1278);
    expect(getThroughputPerFreightCar('mk5', 200)).toBe(1405);
    expect(getThroughputPerFreightCar('mk5', 500)).toBe(1494);
  });

  it('should return correct throughput values for all Mk.6 configurations', () => {
    expect(getThroughputPerFreightCar('mk6', 50)).toBe(1431);
    expect(getThroughputPerFreightCar('mk6', 100)).toBe(1793);
    expect(getThroughputPerFreightCar('mk6', 200)).toBe(2052);
    expect(getThroughputPerFreightCar('mk6', 500)).toBe(2247);
  });
});

describe('calculateFreightCarsLegacy (deprecated)', () => {
  it('should calculate freight cars correctly using old formula', () => {
    // Example: Uranium with 600 parts/min, 5 min loop, 100 stack = 1.88 -> 2
    const result = calculateFreightCarsLegacy(5, 600, 100);
    expect(result).toBe(2);
  });

  it('should return 0 for zero inputs', () => {
    expect(calculateFreightCarsLegacy(0, 100, 50)).toBe(0);
    expect(calculateFreightCarsLegacy(5, 0, 50)).toBe(0);
  });
});

describe('getTotalFreightCars', () => {
  it('should sum freight cars from all items', () => {
    const items: Item[] = [
      {
        id: '1',
        name: 'Iron',
        requiredParts: 100,
        stackSize: 100,
        beltTier: 'mk5',
        imageData: null,
        freightCars: 4,
      },
      {
        id: '2',
        name: 'Copper',
        requiredParts: 50,
        stackSize: 100,
        beltTier: 'mk5',
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
        requiredParts: 100,
        stackSize: 100,
        beltTier: 'mk5',
        imageData: null,
        freightCars: 3,
      },
    ];

    expect(getTotalFreightCars(items)).toBe(3);
  });
});
