import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';
import type { TrainVisualizationProps, Item } from '@/types';
import { getTotalFreightCars } from '@/lib/calculations';
import { getItemColor } from '@/lib/colorUtils';
import { Locomotive } from './Locomotive';
import { FreightCar } from './FreightCar';
import { TrainLegend } from './TrainLegend';
import styles from './TrainVisualization.module.css';

export function TrainVisualization({ items, onReorder }: TrainVisualizationProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && onReorder) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        onReorder(oldIndex, newIndex);
      }
    }
  };

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
  // Each item appears once with all its freight cars grouped together
  const freightCarGroups: Array<{ item: Item; color: string; count: number }> = items.map((item, index) => ({
    item,
    color: getItemColor(index),
    count: item.freightCars,
  }));

  return (
    <div className={styles.visualization}>
      <div className={styles.header}>
        <h2>Train Configuration</h2>
        <p>
          Total Freight Cars: <strong>{totalFreightCars}</strong>
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className={styles.trainContainer}>
          <div className={styles.train}>
            <Locomotive position="front" />
            <SortableContext
              items={items.map((item) => item.id)}
              strategy={horizontalListSortingStrategy}
            >
              {freightCarGroups.map((group) =>
                // Render each freight car for this item
                Array.from({ length: group.count }).map((_, carIndex) => (
                  <FreightCar
                    key={`${group.item.id}-${carIndex}`}
                    item={group.item}
                    color={group.color}
                  />
                ))
              )}
            </SortableContext>
            <Locomotive position="back" />
          </div>
        </div>
      </DndContext>

      <TrainLegend items={items} />
    </div>
  );
}
