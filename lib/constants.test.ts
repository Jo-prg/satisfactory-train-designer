import { 
  FREIGHT_CAR_CAPACITY, 
  SUPPORTED_STACK_SIZES, 
  BELT_THROUGHPUT_TABLE,
  getBeltThroughputKey,
  getThroughputPerFreightCar,
  type BeltTier,
  type StackSize
} from './constants';

describe('constants', () => {
  describe('FREIGHT_CAR_CAPACITY', () => {
    it('should be 32 slots per freight car', () => {
      expect(FREIGHT_CAR_CAPACITY).toBe(32);
    });
  });

  describe('SUPPORTED_STACK_SIZES', () => {
    it('should include all wiki-tested stack sizes', () => {
      expect(SUPPORTED_STACK_SIZES).toEqual([50, 100, 200, 500]);
    });

    it('should be readonly', () => {
      // TypeScript should enforce this at compile time
      expect(Array.isArray(SUPPORTED_STACK_SIZES)).toBe(true);
    });
  });

  describe('BELT_THROUGHPUT_TABLE', () => {
    it('should contain all Mk.5 throughput values', () => {
      expect(BELT_THROUGHPUT_TABLE['mk5-50']).toBe(1083);
      expect(BELT_THROUGHPUT_TABLE['mk5-100']).toBe(1278);
      expect(BELT_THROUGHPUT_TABLE['mk5-200']).toBe(1405);
      expect(BELT_THROUGHPUT_TABLE['mk5-500']).toBe(1494);
    });

    it('should contain all Mk.6 throughput values', () => {
      expect(BELT_THROUGHPUT_TABLE['mk6-50']).toBe(1431);
      expect(BELT_THROUGHPUT_TABLE['mk6-100']).toBe(1793);
      expect(BELT_THROUGHPUT_TABLE['mk6-200']).toBe(2052);
      expect(BELT_THROUGHPUT_TABLE['mk6-500']).toBe(2247);
    });

    it('should have exactly 8 entries (2 belt tiers × 4 stack sizes)', () => {
      expect(Object.keys(BELT_THROUGHPUT_TABLE).length).toBe(8);
    });
  });

  describe('getBeltThroughputKey', () => {
    it('should format key correctly for Mk.5 belts', () => {
      expect(getBeltThroughputKey('mk5', 50)).toBe('mk5-50');
      expect(getBeltThroughputKey('mk5', 100)).toBe('mk5-100');
      expect(getBeltThroughputKey('mk5', 200)).toBe('mk5-200');
      expect(getBeltThroughputKey('mk5', 500)).toBe('mk5-500');
    });

    it('should format key correctly for Mk.6 belts', () => {
      expect(getBeltThroughputKey('mk6', 50)).toBe('mk6-50');
      expect(getBeltThroughputKey('mk6', 100)).toBe('mk6-100');
      expect(getBeltThroughputKey('mk6', 200)).toBe('mk6-200');
      expect(getBeltThroughputKey('mk6', 500)).toBe('mk6-500');
    });
  });

  describe('getThroughputPerFreightCar', () => {
    describe('Mk.5 belt tier', () => {
      it('should return correct throughput for stack size 50', () => {
        expect(getThroughputPerFreightCar('mk5', 50)).toBe(1083);
      });

      it('should return correct throughput for stack size 100', () => {
        expect(getThroughputPerFreightCar('mk5', 100)).toBe(1278);
      });

      it('should return correct throughput for stack size 200', () => {
        expect(getThroughputPerFreightCar('mk5', 200)).toBe(1405);
      });

      it('should return correct throughput for stack size 500', () => {
        expect(getThroughputPerFreightCar('mk5', 500)).toBe(1494);
      });
    });

    describe('Mk.6 belt tier', () => {
      it('should return correct throughput for stack size 50', () => {
        expect(getThroughputPerFreightCar('mk6', 50)).toBe(1431);
      });

      it('should return correct throughput for stack size 100', () => {
        expect(getThroughputPerFreightCar('mk6', 100)).toBe(1793);
      });

      it('should return correct throughput for stack size 200', () => {
        expect(getThroughputPerFreightCar('mk6', 200)).toBe(2052);
      });

      it('should return correct throughput for stack size 500', () => {
        expect(getThroughputPerFreightCar('mk6', 500)).toBe(2247);
      });
    });

    describe('error handling', () => {
      it('should throw error for unsupported belt/stack combination', () => {
        // This would only happen if someone bypasses TypeScript types
        const invalidBeltTier = 'mk7' as BeltTier;
        const validStackSize = 100 as StackSize;
        
        expect(() => {
          getThroughputPerFreightCar(invalidBeltTier, validStackSize);
        }).toThrow('Unsupported belt tier/stack size combination');
      });
    });

    describe('throughput values consistency', () => {
      it('should have higher throughput for Mk.6 than Mk.5 for all stack sizes', () => {
        SUPPORTED_STACK_SIZES.forEach(stackSize => {
          const mk5Throughput = getThroughputPerFreightCar('mk5', stackSize);
          const mk6Throughput = getThroughputPerFreightCar('mk6', stackSize);
          expect(mk6Throughput).toBeGreaterThan(mk5Throughput);
        });
      });

      it('should have increasing throughput as stack size increases', () => {
        const beltTiers: BeltTier[] = ['mk5', 'mk6'];
        
        beltTiers.forEach(beltTier => {
          const throughputs = SUPPORTED_STACK_SIZES.map(size => 
            getThroughputPerFreightCar(beltTier, size)
          );
          
          // Check that each value is greater than the previous
          for (let i = 1; i < throughputs.length; i++) {
            expect(throughputs[i]).toBeGreaterThan(throughputs[i - 1]);
          }
        });
      });
    });
  });
});
