/**
 * Convert image file to Base64 string
 */
export function encodeImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result;
      if (typeof result === 'string') {
        resolve(result);
      } else {
        reject(new Error('Failed to encode image'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
