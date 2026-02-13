'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import type { ModalProps } from '@/types';
import styles from './Modal.module.css';

export function Modal({ isOpen, onClose, title, children, footer }: ModalProps) {
  // Handle Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={`${styles.modal} ${isOpen ? styles.active : ''}`}>
      <div className={styles.backdrop} onClick={onClose} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h2>{title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
        <div className={styles.body}>
          {children}
        </div>
        {footer && (
          <div className={styles.footer}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
