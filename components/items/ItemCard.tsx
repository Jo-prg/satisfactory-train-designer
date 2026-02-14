'use client';

import { Edit, Trash2 } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type { ItemCardProps } from '@/types';
import { Badge } from '@/components/ui/Badge';
import styles from './ItemCard.module.css';

export function ItemCard({ item, onEdit, onDelete }: ItemCardProps) {
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
  };

  const handleDelete = () => {
    if (confirm(`Are you sure you want to delete "${item.name}"?`)) {
      onDelete(item.id);
    }
  };

  return (
    <div 
      ref={setNodeRef}
      className={`${styles.card} ${isDragging ? styles.dragging : ''}`}
      style={style}
      {...attributes}
      {...listeners}
      onClick={() => onEdit(item.id)}
    >
      <div className={styles.thumbnail}>
        {item.imageData ? (
          <img src={item.imageData} alt={item.name} />
        ) : (
          <div className={styles.placeholder}>
            {item.name.charAt(0).toUpperCase()}
          </div>
        )}
      </div>
      
      <div className={styles.details}>
        <h3 className={styles.name}>{item.name}</h3>
        <div className={styles.stats}>
          <span><strong>Belt:</strong> {item.beltTier.toUpperCase()}</span>
          <span><strong>Parts/min:</strong> {item.requiredParts}</span>
          <span><strong>Stack:</strong> {item.stackSize}</span>
        </div>
      </div>

      <Badge value={item.freightCars} label="Freight Cars" />

      <div 
        className={styles.actions} 
        onClick={(e) => {
          e.stopPropagation();
        }}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <button
          className={styles.editBtn}
          onClick={() => onEdit(item.id)}
          title="Edit"
          aria-label="Edit item"
        >
          <Edit size={16} />
        </button>
        <button
          className={styles.deleteBtn}
          onClick={handleDelete}
          title="Delete"
          aria-label="Delete item"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}
