export function generateTrainId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 11);
  return `train-${timestamp}-${random}`;
}
