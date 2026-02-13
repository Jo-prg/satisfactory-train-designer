import { validateFormData, validateImageFile } from './validation';
import type { ItemFormData } from '@/types';

describe('validateFormData', () => {
  it('should return no errors for valid data', () => {
    const validData: ItemFormData = {
      name: 'Iron Ore',
      loopTime: 5,
      requiredParts: 100,
      stackSize: 100,
      imageData: null,
    };

    const errors = validateFormData(validData);
    expect(errors).toEqual({});
  });

  it('should return error for empty name', () => {
    const invalidData: ItemFormData = {
      name: '',
      loopTime: 5,
      requiredParts: 100,
      stackSize: 100,
      imageData: null,
    };

    const errors = validateFormData(invalidData);
    expect(errors.name).toBeDefined();
  });

  it('should return error for zero loop time', () => {
    const invalidData: ItemFormData = {
      name: 'Test',
      loopTime: 0,
      requiredParts: 100,
      stackSize: 100,
      imageData: null,
    };

    const errors = validateFormData(invalidData);
    expect(errors.loopTime).toBeDefined();
  });

  it('should return error for negative required parts', () => {
    const invalidData: ItemFormData = {
      name: 'Test',
      loopTime: 5,
      requiredParts: -10,
      stackSize: 100,
      imageData: null,
    };

    const errors = validateFormData(invalidData);
    expect(errors.requiredParts).toBeDefined();
  });

  it('should return error for stack size less than 1', () => {
    const invalidData: ItemFormData = {
      name: 'Test',
      loopTime: 5,
      requiredParts: 100,
      stackSize: 0,
      imageData: null,
    };

    const errors = validateFormData(invalidData);
    expect(errors.stackSize).toBeDefined();
  });

  it('should return multiple errors for multiple invalid fields', () => {
    const invalidData: ItemFormData = {
      name: '',
      loopTime: -5,
      requiredParts: 0,
      stackSize: 0,
      imageData: null,
    };

    const errors = validateFormData(invalidData);
    expect(Object.keys(errors).length).toBeGreaterThan(1);
  });

  it('should trim whitespace from name', () => {
    const data: ItemFormData = {
      name: '  Iron Ore  ',
      loopTime: 5,
      requiredParts: 100,
      stackSize: 100,
      imageData: null,
    };

    const errors = validateFormData(data);
    expect(errors).toEqual({});
  });
});

describe('validateImageFile', () => {
  it('should accept valid PNG file under 500KB', () => {
    const file = new File(['fake content'], 'test.png', {
      type: 'image/png',
    });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
    expect(result.error).toBeUndefined();
  });

  it('should accept valid JPEG file', () => {
    const file = new File(['fake content'], 'test.jpg', {
      type: 'image/jpeg',
    });
    Object.defineProperty(file, 'size', { value: 200 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should reject file over 500KB', () => {
    const file = new File(['fake content'], 'large.png', {
      type: 'image/png',
    });
    Object.defineProperty(file, 'size', { value: 600 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('500KB');
  });

  it('should reject invalid file type', () => {
    const file = new File(['fake content'], 'test.pdf', {
      type: 'application/pdf',
    });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(false);
    expect(result.error).toBeDefined();
  });

  it('should accept WebP format', () => {
    const file = new File(['fake content'], 'test.webp', {
      type: 'image/webp',
    });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });

  it('should accept GIF format', () => {
    const file = new File(['fake content'], 'test.gif', {
      type: 'image/gif',
    });
    Object.defineProperty(file, 'size', { value: 100 * 1024 });

    const result = validateImageFile(file);
    expect(result.valid).toBe(true);
  });
});
