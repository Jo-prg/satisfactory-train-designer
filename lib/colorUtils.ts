/**
 * Get a color for an item based on its index
 * Returns colors from a predefined palette
 */
export function getItemColor(index: number): string {
  const colors = [
    '#667eea',
    '#764ba2',
    '#f093fb',
    '#4facfe',
    '#43e97b',
    '#fa709a',
    '#fee140',
    '#30cfd0'
  ];
  return colors[index % colors.length];
}
