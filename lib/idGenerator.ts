/**
 * Generate a unique ID for an item
 * Uses timestamp + random string
 */
export function generateItemId(): string {
  return Date.now() + '-' + Math.random().toString(36).substr(2, 9);
}
