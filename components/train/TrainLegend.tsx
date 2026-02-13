import type { Item } from '@/types';
import { getItemColor } from '@/lib/colorUtils';
import styles from './TrainLegend.module.css';

interface TrainLegendProps {
  items: Item[];
}

export function TrainLegend({ items }: TrainLegendProps) {
  return (
    <div className={styles.legend}>
      {items.map((item, index) => (
        <div key={item.id} className={styles.legendItem}>
          <div
            className={styles.legendColor}
            style={{ backgroundColor: getItemColor(index) }}
          />
          <span>
            {item.name}: {item.freightCars} car{item.freightCars !== 1 ? 's' : ''}
          </span>
        </div>
      ))}
    </div>
  );
}
