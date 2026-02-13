'use client';

import { useState, useCallback } from 'react';
import { encodeImageToBase64 } from '@/lib/imageUtils';
import { validateImageFile } from '@/lib/validation';

/**
 * Custom hook for managing image upload state
 */
export function useImageUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>(undefined);

  const handleFileChange = useCallback(async (selectedFile: File | null) => {
    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      setError(undefined);
      return;
    }

    // Validate file
    const validation = validateImageFile(selectedFile);
    if (!validation.valid) {
      setError(validation.error);
      setFile(null);
      setPreview(null);
      return;
    }

    // Clear error and set file
    setError(undefined);
    setFile(selectedFile);

    // Generate preview
    try {
      const base64 = await encodeImageToBase64(selectedFile);
      setPreview(base64);
    } catch (err) {
      console.error('Error encoding image:', err);
      setError('Failed to load image preview');
      setFile(null);
      setPreview(null);
    }
  }, []);

  const reset = useCallback(() => {
    setFile(null);
    setPreview(null);
    setError(undefined);
  }, []);

  const getBase64 = useCallback(async (): Promise<string | null> => {
    if (!file) return null;
    try {
      return await encodeImageToBase64(file);
    } catch (err) {
      console.error('Error encoding image:', err);
      return null;
    }
  }, [file]);

  return {
    file,
    preview,
    error,
    handleFileChange,
    reset,
    getBase64,
  };
}
