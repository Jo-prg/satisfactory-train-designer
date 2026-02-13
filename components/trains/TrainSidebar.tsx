import { Plus } from 'lucide-react';
import type { TrainSidebarProps } from '@/types';
import { TrainListItem } from './TrainListItem';
import { Button } from '@/components/ui/Button';
import styles from './TrainSidebar.module.css';

export function TrainSidebar({
  trains,
  activeTrainId,
  onSelectTrain,
  onNewTrain,
  onRenameTrain,
  onDeleteTrain,
  hasUnsavedChanges,
}: TrainSidebarProps) {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h2 className={styles.title}>Trains</h2>
        <Button variant="primary" onClick={onNewTrain} className={styles.newButton}>
          <Plus size={18} /> New
        </Button>
      </div>

      {hasUnsavedChanges && (
        <div className={styles.unsavedBanner}>
          <span className={styles.unsavedDot}>●</span>
          Unsaved changes
        </div>
      )}

      <div className={styles.trainList}>
        {trains.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No saved trains yet</p>
            <p className={styles.emptyHint}>Create your first train to get started</p>
          </div>
        ) : (
          trains.map((train) => (
            <TrainListItem
              key={train.id}
              train={train}
              isActive={train.id === activeTrainId}
              onClick={() => onSelectTrain(train.id)}
              onRename={() => onRenameTrain(train.id)}
              onDelete={() => onDeleteTrain(train.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
