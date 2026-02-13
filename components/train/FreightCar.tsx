import type { FreightCarProps } from '@/types';
import styles from './FreightCar.module.css';

export function FreightCar({ item, color }: FreightCarProps) {
  return (
    <div className={styles.freightCar} style={{ borderColor: color }}>
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
