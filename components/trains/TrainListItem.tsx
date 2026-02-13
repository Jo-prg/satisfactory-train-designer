import { Edit, Trash2 } from 'lucide-react';
import type { TrainListItemProps } from '@/types';
import { getTotalFreightCars } from '@/lib/calculations';
import { Button } from '@/components/ui/Button';
import styles from './TrainListItem.module.css';

export function TrainListItem({ train, isActive, onClick, onRename, onDelete }: TrainListItemProps) {
  const itemCount = train.items.length;
  const freightCarCount = getTotalFreightCars(train.items);

  const handleRenameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRename();
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${train.name}"?`)) {
      onDelete();
    }
  };

  const lastUpdated = new Date(train.updatedAt).toLocaleDateString();

  return (
    <div
      className={`${styles.trainItem} ${isActive ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.content}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{train.name}</span>
          {isActive && <span className={styles.activeDot}>●</span>}
        </div>
        
        <div className={styles.stats}>
          <span className={styles.stat}>{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
          <span className={styles.separator}>•</span>
          <span className={styles.stat}>{freightCarCount} car{freightCarCount !== 1 ? 's' : ''}</span>
        </div>
        
        <div className={styles.timestamp}>
          Updated {lastUpdated}
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          variant="icon"
          onClick={handleRenameClick}
          aria-label="Rename train"
          title="Rename train"
        >
          <Edit size={16} />
        </Button>
        <Button
          variant="icon"
          onClick={handleDeleteClick}
          aria-label="Delete train"
          title="Delete train"
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}
