import { generateItemId } from './idGenerator';

describe('generateItemId', () => {
  it('should generate a non-empty string', () => {
    const id = generateItemId();
    expect(id).toBeTruthy();
    expect(typeof id).toBe('string');
  });

  it('should generate unique IDs', () => {
    const id1 = generateItemId();
    const id2 = generateItemId();
    expect(id1).not.toBe(id2);
  });

  it('should contain timestamp and random parts', () => {
    const id = generateItemId();
    expect(id).toContain('-');
    const parts = id.split('-');
    expect(parts.length).toBe(2);
    expect(parts[0]).not.toBe('');
    expect(parts[1]).not.toBe('');
  });

  it('should generate IDs with increasing timestamps', async () => {
    const id1 = generateItemId();
    await new Promise(resolve => setTimeout(resolve, 10));
    const id2 = generateItemId();
    
    const timestamp1 = parseInt(id1.split('-')[0]);
    const timestamp2 = parseInt(id2.split('-')[0]);
    expect(timestamp2).toBeGreaterThanOrEqual(timestamp1);
  });
});
