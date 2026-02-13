import type { ButtonProps } from '@/types';
import styles from './Button.module.css';

export function Button({ variant = 'primary', children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
