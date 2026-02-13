'use client';

import { useEffect } from 'react';
import { useImageUpload } from '@/hooks/useImageUpload';
import { FormField } from '@/components/ui/FormField';
import styles from './ImageUploadField.module.css';

interface ImageUploadFieldProps {
  onChange: (base64: string | null) => void;
  initialPreview?: string | null;
  error?: string;
}

export function ImageUploadField({ onChange, initialPreview, error }: ImageUploadFieldProps) {
  const { file, preview, error: uploadError, handleFileChange, reset } = useImageUpload();

  useEffect(() => {
    if (preview) {
      onChange(preview);
    } else if (!file) {
      onChange(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preview, file]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileChange(selectedFile);
  };

  const displayPreview = preview || initialPreview;
  const displayError = error || uploadError;

  return (
    <FormField label="Item Image" error={displayError}>
      <input
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
        onChange={handleChange}
        className={styles.fileInput}
      />
      {displayPreview && (
        <div className={styles.preview}>
          <img src={displayPreview} alt="Preview" />
        </div>
      )}
    </FormField>
  );
}
