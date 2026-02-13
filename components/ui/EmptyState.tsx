import type { EmptyStateProps } from '@/types';
import styles from './EmptyState.module.css';

export function EmptyState({ message = 'No items yet' }: EmptyStateProps) {
  return (
    <div className={styles.emptyState}>
      <p>{message}</p>
      <p>Click &quot;Add an item +&quot; to start designing your train.</p>
    </div>
  );
}
