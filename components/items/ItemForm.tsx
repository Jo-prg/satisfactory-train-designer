'use client';

import { useState, useEffect, useCallback } from 'react';
import Select from 'react-select';
import type { ItemFormProps } from '@/types';
import { FormField } from '@/components/ui/FormField';
import { ImageUploadField } from './ImageUploadField';
import { validateFormData } from '@/lib/validation';
import { SUPPORTED_STACK_SIZES, type BeltTier, type StackSize } from '@/lib/constants';
import styles from './ItemForm.module.css';

const beltTierOptions = [
  { value: 'mk5' as BeltTier, label: 'Mk.5 Belt (780 items/min)' },
  { value: 'mk6' as BeltTier, label: 'Mk.6 Belt (1200 items/min)' },
];

// Custom styles for react-select to match dark theme
const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: state.isFocused ? '#e59344' : 'rgba(255, 255, 255, 0.2)',
    borderWidth: '2px',
    borderRadius: '6px',
    padding: '6px',
    boxShadow: 'none',
    cursor: 'pointer',
    transition: 'border-color 0.3s',
    '&:hover': {
      borderColor: state.isFocused ? '#e59344' : 'rgba(255, 255, 255, 0.3)',
    },
  }),
  menu: (base: any) => ({
    ...base,
    backgroundColor: '#2a2a2a',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '6px',
    marginTop: '4px',
  }),
  menuList: (base: any) => ({
    ...base,
    padding: '4px',
  }),
  option: (base: any, state: any) => ({
    ...base,
    backgroundColor: state.isSelected 
      ? 'rgba(229, 147, 68, 0.3)' 
      : state.isFocused 
        ? 'rgba(255, 255, 255, 0.1)' 
        : 'transparent',
    color: '#f0f0f0',
    cursor: 'pointer',
    padding: '10px 12px',
    borderRadius: '4px',
    transition: 'background-color 0.2s',
    '&:active': {
      backgroundColor: 'rgba(229, 147, 68, 0.4)',
    },
  }),
  singleValue: (base: any) => ({
    ...base,
    color: '#f0f0f0',
  }),
  placeholder: (base: any) => ({
    ...base,
    color: 'rgba(255, 255, 255, 0.5)',
  }),
  input: (base: any) => ({
    ...base,
    color: '#f0f0f0',
  }),
};

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
        <Select
          value={beltTierOptions.find(opt => opt.value === formData.beltTier)}
          onChange={(option) => option && setFormData((prev) => ({ ...prev, beltTier: option.value }))}
          options={beltTierOptions}
          styles={selectStyles}
          isSearchable={false}
        />
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
