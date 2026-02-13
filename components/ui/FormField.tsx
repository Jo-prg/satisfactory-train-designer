import type { FormFieldProps } from '@/types';
import styles from './FormField.module.css';

export function FormField({ label, error, required = false, children }: FormFieldProps) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}
