'use client';

import { Plus } from 'lucide-react';
import { useItems } from '@/hooks/useItems';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/Button';
import { ItemList } from '@/components/items/ItemList';
import { ItemModal } from '@/components/items/ItemModal';
import { TrainVisualization } from '@/components/train/TrainVisualization';
import type { ItemFormData } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const { items, addItem, updateItem, deleteItem } = useItems();
  const { isOpen, mode, editingItemId, open, close } = useModal();

  const handleAddClick = () => {
    open('add');
  };

  const handleEdit = (id: string) => {
    open('edit', id);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
  };

  const handleSave = (data: ItemFormData) => {
    if (mode === 'add') {
      addItem(data);
    } else if (mode === 'edit' && editingItemId) {
      updateItem(editingItemId, data);
    }
    close();
  };

  return (
    <div className={styles.container}>
      <h1>Satisfactory Train Designer</h1>
      
      <Button variant="primary" onClick={handleAddClick} className={styles.addButton}>
        <Plus size={20} /> Add an item
      </Button>

      <ItemList items={items} onEdit={handleEdit} onDelete={handleDelete} />

      <TrainVisualization items={items} />

      <ItemModal
        isOpen={isOpen}
        mode={mode}
        editingItemId={editingItemId}
        onClose={close}
        onSave={handleSave}
        items={items}
      />
    </div>
  );
}

