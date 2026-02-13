import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { FreightCarProps } from '@/types';
import { DragHandle } from './DragHandle';
import styles from './FreightCar.module.css';

export function FreightCar({ item, color }: FreightCarProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 'auto',
  };

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.freightCar} freightCar`}
      style={{ ...style, borderColor: color }}
    >
      <div className={styles.dragHandleWrapper} {...attributes} {...listeners}>
        <DragHandle isDragging={isDragging} />
      </div>
      <img src="/freightcar.svg" alt="Freight Car" className={styles.carBase} />
      <div className={styles.carContent}>
        {item.imageData ? (
          <img src={item.imageData} alt={item.name} className={styles.itemImage} />
        ) : (
          <span className={styles.itemLabel}>{item.name}</span>
        )}
      </div>
      <div className={styles.carTooltip}>{item.name}</div>
    </div>
  );
}

