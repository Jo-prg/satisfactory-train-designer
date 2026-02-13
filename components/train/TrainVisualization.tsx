import type { TrainVisualizationProps, Item } from '@/types';
import { getTotalFreightCars } from '@/lib/calculations';
import { getItemColor } from '@/lib/colorUtils';
import { Locomotive } from './Locomotive';
import { FreightCar } from './FreightCar';
import { TrainLegend } from './TrainLegend';
import styles from './TrainVisualization.module.css';

export function TrainVisualization({ items }: TrainVisualizationProps) {
  if (items.length === 0) {
    return null;
  }

  const totalFreightCars = getTotalFreightCars(items);

  if (totalFreightCars === 0) {
    return (
      <div className={styles.visualization}>
        <div className={styles.empty}>
          <p>No freight cars needed (all calculations result in 0 cars)</p>
        </div>
      </div>
    );
  }

  // Build freight cars array with item assignments
  const freightCars: { item: Item; color: string }[] = [];
  items.forEach((item, itemIndex) => {
    const color = getItemColor(itemIndex);
    for (let i = 0; i < item.freightCars; i++) {
      freightCars.push({ item, color });
    }
  });

  return (
    <div className={styles.visualization}>
      <div className={styles.header}>
        <h2>Train Configuration</h2>
        <p>
          Total Freight Cars: <strong>{totalFreightCars}</strong>
        </p>
      </div>

      <div className={styles.trainContainer}>
        <div className={styles.train}>
          <Locomotive position="front" />
          {freightCars.map((car, index) => (
            <FreightCar key={index} item={car.item} color={car.color} />
          ))}
          <Locomotive position="back" />
        </div>
      </div>

      <TrainLegend items={items} />
    </div>
  );
}
