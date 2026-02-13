'use client';

import type { ItemListProps } from '@/types';
import { ItemCard } from './ItemCard';
import { EmptyState } from '@/components/ui/EmptyState';
import styles from './ItemList.module.css';

export function ItemList({ items, onEdit, onDelete }: ItemListProps) {
  if (items.length === 0) {
    return <EmptyState message="No items added yet." />;
  }

  return (
    <div className={styles.list}>
      {items.map((item) => (
        <ItemCard
          key={item.id}
          item={item}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
