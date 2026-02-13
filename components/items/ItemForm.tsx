'use client';

import { useState, useEffect } from 'react';
import type { ItemFormProps } from '@/types';
import { FormField } from '@/components/ui/FormField';
import { ImageUploadField } from './ImageUploadField';
import { validateFormData } from '@/lib/validation';
import styles from './ItemForm.module.css';

export function ItemForm({ mode, initialData, onSubmit, onCancel }: ItemFormProps) {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    loopTime: initialData?.loopTime || 0,
    requiredParts: initialData?.requiredParts || 0,
    stackSize: initialData?.stackSize || 1,
    imageData: initialData?.imageData || null,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        loopTime: initialData.loopTime || 0,
        requiredParts: initialData.requiredParts || 0,
        stackSize: initialData.stackSize || 1,
        imageData: initialData.imageData || null,
      });
    }
  }, [initialData]);

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
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., Uranium, Iron Ore"
          className={styles.input}
        />
      </FormField>

      <FormField label="Time for one loop" required error={errors.loopTime}>
        <div className={styles.inputWrapper}>
          <input
            type="number"
            value={formData.loopTime || ''}
            onChange={(e) => setFormData({ ...formData, loopTime: parseFloat(e.target.value) || 0 })}
            min="0"
            step="0.1"
            className={styles.input}
          />
          <span className={styles.unit}>minutes</span>
        </div>
      </FormField>

      <FormField label="Required parts/min" required error={errors.requiredParts}>
        <input
          type="number"
          value={formData.requiredParts || ''}
          onChange={(e) => setFormData({ ...formData, requiredParts: parseFloat(e.target.value) || 0 })}
          min="0"
          step="0.1"
          className={styles.input}
        />
      </FormField>

      <FormField label="Stack size" required error={errors.stackSize}>
        <input
          type="number"
          value={formData.stackSize || ''}
          onChange={(e) => setFormData({ ...formData, stackSize: parseInt(e.target.value) || 1 })}
          min="1"
          step="1"
          className={styles.input}
        />
      </FormField>

      <ImageUploadField
        onChange={(imageData) => setFormData({ ...formData, imageData })}
        initialPreview={initialData?.imageData}
        error={errors.imageData}
      />
    </form>
  );
}
