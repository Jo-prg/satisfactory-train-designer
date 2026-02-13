import type { UnsavedChangesModalProps } from '@/types';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { AlertTriangle } from 'lucide-react';
import styles from './UnsavedChangesModal.module.css';

export function UnsavedChangesModal({
  isOpen,
  trainName,
  onSave,
  onDiscard,
  onCancel,
}: UnsavedChangesModalProps) {
  const footer = (
    <>
      <Button variant="secondary" onClick={onCancel}>
        Cancel
      </Button>
      <Button variant="secondary" onClick={onDiscard} className={styles.discardButton}>
        Discard Changes
      </Button>
      <Button variant="primary" onClick={onSave}>
        Save Changes
      </Button>
    </>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Unsaved Changes"
      footer={footer}
    >
      <div className={styles.content}>
        <div className={styles.iconWrapper}>
          <AlertTriangle className={styles.icon} size={48} />
        </div>
        
        <p className={styles.message}>
          You have unsaved changes{trainName ? ` to "${trainName}"` : ''}.
        </p>
        
        <p className={styles.question}>
          Would you like to save your changes before switching trains?
        </p>
      </div>
    </Modal>
  );
}
