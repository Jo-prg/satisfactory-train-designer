'use client';

import { useState, useRef, useEffect } from 'react';
import type { ItemModalProps } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ItemForm } from './ItemForm';

export function ItemModal({ isOpen, mode, editingItemId, onClose, onSave, items }: ItemModalProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [formKey, setFormKey] = useState(0);

  // Reset form when modal opens or mode changes
  useEffect(() => {
    if (isOpen) {
      setFormKey((prev) => prev + 1);
    }
  }, [isOpen, mode, editingItemId]);

  const initialData = editingItemId
    ? items.find((item) => item.id === editingItemId)
    : undefined;

  const handleSave = () => {
    // Trigger form submission
    const form = document.querySelector('form') as HTMLFormElement;
    if (form) {
      form.requestSubmit();
    }
  };

  const footer = (
    <>
      <Button variant="secondary" onClick={onClose}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSave}>
        Save
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mode === 'add' ? 'Add Item' : 'Edit Item'}
      footer={footer}
    >
      <ItemForm
        key={formKey}
        mode={mode}
        initialData={initialData}
        onSubmit={onSave}
        onCancel={onClose}
      />
    </Modal>
  );
}
