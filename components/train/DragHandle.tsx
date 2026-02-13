import styles from './DragHandle.module.css';

interface DragHandleProps {
  isDragging?: boolean;
}

export function DragHandle({ isDragging = false }: DragHandleProps) {
  return (
    <div 
      className={`${styles.dragHandle} ${isDragging ? styles.dragging : ''}`}
      title="Drag to reorder"
      role="button"
      aria-label="Drag to reorder freight car"
      tabIndex={0}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle cx="5" cy="4" r="1.5" fill="currentColor" />
        <circle cx="11" cy="4" r="1.5" fill="currentColor" />
        <circle cx="5" cy="8" r="1.5" fill="currentColor" />
        <circle cx="11" cy="8" r="1.5" fill="currentColor" />
        <circle cx="5" cy="12" r="1.5" fill="currentColor" />
        <circle cx="11" cy="12" r="1.5" fill="currentColor" />
      </svg>
    </div>
  );
}
