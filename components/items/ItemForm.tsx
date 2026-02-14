'use client';

import { useState, useEffect, useCallback } from 'react';
import type { ItemFormProps } from '@/types';
import { FormField } from '@/components/ui/FormField';
import { ImageUploadField } from './ImageUploadField';
import { validateFormData } from '@/lib/validation';
import { SUPPORTED_STACK_SIZES, type BeltTier, type StackSize } from '@/lib/constants';
import styles from './ItemForm.module.css';

export function ItemForm({ mode, initialData, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    loopTime: initialData?.loopTime,  // Hidden but preserved for storage
    requiredParts: initialData?.requiredParts || 0,
    stackSize: (initialData?.stackSize || 100) as StackSize,
    beltTier: (initialData?.beltTier || 'mk5') as BeltTier,
    imageData: initialData?.imageData || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Only run once when component mounts - rely on key prop to reset form
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        loopTime: initialData.loopTime,
        requiredParts: initialData.requiredParts || 0,
        stackSize: (initialData.stackSize || 100) as StackSize,
        beltTier: (initialData.beltTier || 'mk5') as BeltTier,
        imageData: initialData.imageData || null,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateFormData(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <FormField label="Item Name" required error={errors.name}>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
          placeholder="e.g., Uranium, Iron Ore"
          className={styles.input}
        />
      </FormField>

      <FormField label="Required parts/min" required error={errors.requiredParts}>
        <input
          type="number"
          value={formData.requiredParts || ''}
          onChange={(e) => setFormData((prev) => ({ ...prev, requiredParts: parseFloat(e.target.value) || 0 }))}
          min="0"
          step="0.1"
          className={styles.input}
        />
      </FormField>

      <FormField label="Belt Tier" required error={errors.beltTier}>
        <select
          value={formData.beltTier}
          onChange={(e) => setFormData((prev) => ({ ...prev, beltTier: e.target.value as BeltTier }))}
          className={styles.input}
        >
          <option value="mk5">Mk.5 Belt (780 items/min)</option>
          <option value="mk6">Mk.6 Belt (1200 items/min)</option>
        </select>
      </FormField>

      <FormField label="Stack Size" required error={errors.stackSize}>
        <div className={styles.radioGroup}>
          {SUPPORTED_STACK_SIZES.map((size) => (
            <label key={size} className={styles.radioLabel}>
              <input
                type="radio"
                name="stackSize"
                value={size}
                checked={formData.stackSize === size}
                onChange={(e) => setFormData((prev) => ({ ...prev, stackSize: parseInt(e.target.value) as StackSize }))}
                className={styles.radioInput}
              />
              <span className={styles.radioText}>{size}</span>
            </label>
          ))}
        </div>
      </FormField>

      <ImageUploadField
        onChange={useCallback((imageData) => setFormData((prev) => ({ ...prev, imageData })), [])}
        initialPreview={initialData?.imageData}
        error={errors.imageData}
      />
    </form>
  );
}
