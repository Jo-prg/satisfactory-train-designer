import type { LocomotiveProps } from '@/types';
import styles from './Locomotive.module.css';

export function Locomotive({ position }: LocomotiveProps) {
  return (
    <div className={`${styles.locomotive} ${styles[position]}`}>
      <img src="/locomotive.svg" alt={`${position} Locomotive`} />
    </div>
  );
}
