import styles from './Badge.module.css';

interface BadgeProps {
  value: number;
  label: string;
}

export function Badge({ value, label }: BadgeProps) {
  return (
    <div className={styles.badgeContainer}>
      <div className={styles.badgeValue}>{value}</div>
      <span className={styles.badgeLabel}>{label}</span>
    </div>
  );
}
