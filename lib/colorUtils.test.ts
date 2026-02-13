import { getItemColor } from './colorUtils';

describe('getItemColor', () => {
  it('should return a color for index 0', () => {
    const color = getItemColor(0);
    expect(color).toBe('#667eea');
  });

  it('should return a color for index 1', () => {
    const color = getItemColor(1);
    expect(color).toBe('#764ba2');
  });

  it('should cycle through colors for indices beyond palette length', () => {
    const color0 = getItemColor(0);
    const color8 = getItemColor(8); // Should wrap around (8 colors in palette)
    expect(color0).toBe(color8);
  });

  it('should return valid hex colors', () => {
    for (let i = 0; i < 10; i++) {
      const color = getItemColor(i);
      expect(color).toMatch(/^#[0-9a-f]{6}$/i);
    }
  });

  it('should handle large indices', () => {
    const color = getItemColor(1000);
    expect(color).toMatch(/^#[0-9a-f]{6}$/i);
  });
});
