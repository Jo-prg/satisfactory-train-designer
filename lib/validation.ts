import { z } from 'zod';
import { itemFormSchema, imageFileSchema, type ItemFormData, type FormErrors } from '@/types';

/**
 * Validate form data using Zod schema
 */
export function validateFormData(data: ItemFormData): FormErrors {
  try {
    itemFormSchema.parse(data);
    return {};
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: FormErrors = {};
      error.issues.forEach((err) => {
        const field = err.path[0] as keyof ItemFormData;
        if (field) {
          errors[field] = err.message;
        }
      });
      return errors;
    }
    return {};
  }
}

/**
 * Validate image file
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
  try {
    imageFileSchema.parse({
      size: file.size,
      type: file.type,
    });
    return { valid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { valid: false, error: error.issues[0]?.message || 'Invalid image file' };
    }
    return { valid: false, error: 'Invalid image file' };
  }
}
