import { useState, useEffect } from 'react';
import type { SaveTrainModalProps } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { FormField } from '@/components/ui/FormField';
import { trainNameSchema } from '@/types';
import styles from './SaveTrainModal.module.css';

export function SaveTrainModal({
  isOpen,
  mode,
  currentName,
  existingNames,
  onClose,
  onSave,
}: SaveTrainModalProps) {
  const [name, setName] = useState(currentName || '');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName(currentName || '');
      setError('');
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate with Zod
    const result = trainNameSchema.safeParse(name);
    if (!result.success) {
      setError(result.error.issues[0].message);
      return;
    }

    // Check for duplicate names (except current name when renaming)
    const trimmedName = name.trim();
    const isDuplicate = existingNames.some(
      existingName => 
        existingName.toLowerCase() === trimmedName.toLowerCase() &&
        existingName !== currentName
    );

    if (isDuplicate) {
      setError('A train with this name already exists');
      return;
    }

    onSave(trimmedName);
    onClose();
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        {mode === 'save' ? 'Save Train' : 'Rename'}
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'save' ? 'Save Train' : 'Rename Train'}
      footer={footer}
    >
      <form onSubmit={handleSubmit} className={styles.form}>
        <FormField label="Train Name" required error={error}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Uranium Transport, Iron Loop"
            className={styles.input}
            autoFocus
            maxLength={50}
          />
        </FormField>
        
        <div className={styles.hint}>
          Give your train a descriptive name to help identify it later.
        </div>
      </form>
    </Modal>
  );
}
