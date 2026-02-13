'use client';

import { useState } from 'react';
import { Plus, Save } from 'lucide-react';
import { useTrains } from '@/hooks/useTrains';
import { useModal } from '@/hooks/useModal';
import { Button } from '@/components/ui/Button';
import { ItemList } from '@/components/items/ItemList';
import { ItemModal } from '@/components/items/ItemModal';
import { TrainVisualization } from '@/components/train/TrainVisualization';
import { TrainSidebar } from '@/components/trains/TrainSidebar';
import { SaveTrainModal } from '@/components/trains/SaveTrainModal';
import { UnsavedChangesModal } from '@/components/trains/UnsavedChangesModal';
import type { ItemFormData, SaveTrainModalState } from '@/types';
import styles from './page.module.css';

export default function Home() {
  const {
    trains,
    activeTrainId,
    activeItems,
    hasUnsavedChanges,
    saveCurrentTrain,
    loadTrain,
    createNewTrain,
    renameTrain,
    deleteTrain,
    getCurrentTrainName,
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
  } = useTrains();

  const { isOpen: isItemModalOpen, mode: itemMode, editingItemId, open: openItemModal, close: closeItemModal } = useModal();
  
  const [saveTrainModal, setSaveTrainModal] = useState<SaveTrainModalState>({
    isOpen: false,
    mode: 'save',
  });

  const [unsavedModal, setUnsavedModal] = useState({
    isOpen: false,
    pendingTrainId: null as string | null,
  });

  // Handle adding item
  const handleAddClick = () => {
    openItemModal('add');
  };

  // Handle editing item
  const handleEdit = (id: string) => {
    openItemModal('edit', id);
  };

  // Handle deleting item
  const handleDelete = (id: string) => {
    deleteItem(id);
  };

  // Handle saving item
  const handleSaveItem = (data: ItemFormData) => {
    if (itemMode === 'add') {
      addItem(data);
    } else if (itemMode === 'edit' && editingItemId) {
      updateItem(editingItemId, data);
    }
    closeItemModal();
  };

  // Handle save train button
  const handleSaveTrainClick = () => {
    if (activeTrainId) {
      // Update existing train
      const trainName = getCurrentTrainName();
      if (trainName) {
        saveCurrentTrain(trainName, activeTrainId);
      }
    } else {
      // New train - open modal for name
      setSaveTrainModal({ isOpen: true, mode: 'save' });
    }
  };

  // Handle save train from modal
  const handleSaveTrainFromModal = (name: string) => {
    if (saveTrainModal.trainId) {
      // Renaming
      renameTrain(saveTrainModal.trainId, name);
    } else {
      // Saving new or updating
      saveCurrentTrain(name, activeTrainId || undefined);
    }
  };

  // Handle selecting train
  const handleSelectTrain = (id: string) => {
    if (id === activeTrainId) return;

    if (hasUnsavedChanges) {
      setUnsavedModal({ isOpen: true, pendingTrainId: id });
    } else {
      loadTrain(id);
    }
  };

  // Handle new train
  const handleNewTrain = () => {
    if (hasUnsavedChanges) {
      setUnsavedModal({ isOpen: true, pendingTrainId: null });
    } else {
      createNewTrain();
    }
  };

  // Handle rename train
  const handleRenameTrain = (id: string) => {
    const train = trains.find(t => t.id === id);
    if (train) {
      setSaveTrainModal({
        isOpen: true,
        mode: 'rename',
        trainId: id,
      });
    }
  };

  // Handle unsaved changes - save
  const handleUnsavedSave = () => {
    if (activeTrainId) {
      const trainName = getCurrentTrainName();
      if (trainName) {
        saveCurrentTrain(trainName, activeTrainId);
        proceedWithPendingAction();
      }
    } else {
      // Need to get a name first
      setSaveTrainModal({ isOpen: true, mode: 'save' });
      // Will proceed after save modal closes
    }
  };

  // Handle unsaved changes - discard
  const handleUnsavedDiscard = () => {
    proceedWithPendingAction();
  };

  // Proceed with pending action after handling unsaved changes
  const proceedWithPendingAction = () => {
    const { pendingTrainId } = unsavedModal;
    setUnsavedModal({ isOpen: false, pendingTrainId: null });

    if (pendingTrainId) {
      loadTrain(pendingTrainId);
    } else {
      createNewTrain();
    }
  };

  const currentTrainName = getCurrentTrainName();
  const existingNames = trains.map(t => t.name);

  return (
    <div className={styles.appLayout}>
      <TrainSidebar
        trains={trains}
        activeTrainId={activeTrainId}
        onSelectTrain={handleSelectTrain}
        onNewTrain={handleNewTrain}
        onRenameTrain={handleRenameTrain}
        onDeleteTrain={deleteTrain}
        hasUnsavedChanges={hasUnsavedChanges}
      />

      <div className={styles.mainContent}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1 className={styles.title}>Satisfactory Train Designer</h1>
            {currentTrainName && (
              <div className={styles.trainName}>
                {currentTrainName}
                {hasUnsavedChanges && <span className={styles.unsavedDot}>●</span>}
              </div>
            )}
          </div>
          
          <Button
            variant="primary"
            onClick={handleSaveTrainClick}
            className={styles.saveButton}
          >
            <Save size={18} />
            {activeTrainId ? 'Save Changes' : 'Save Train'}
          </Button>
        </header>

        <div className={styles.content}>
          <Button variant="primary" onClick={handleAddClick} className={styles.addButton}>
            <Plus size={20} /> Add an item
          </Button>

          <ItemList items={activeItems} onEdit={handleEdit} onDelete={handleDelete} onReorder={reorderItems} />

          <TrainVisualization items={activeItems} onReorder={reorderItems} />
        </div>
      </div>

      <ItemModal
        isOpen={isItemModalOpen}
        mode={itemMode}
        editingItemId={editingItemId}
        onClose={closeItemModal}
        onSave={handleSaveItem}
        items={activeItems}
      />

      <SaveTrainModal
        isOpen={saveTrainModal.isOpen}
        mode={saveTrainModal.mode}
        currentName={saveTrainModal.trainId ? trains.find(t => t.id === saveTrainModal.trainId)?.name : ''}
        existingNames={existingNames}
        onClose={() => setSaveTrainModal({ isOpen: false, mode: 'save' })}
        onSave={handleSaveTrainFromModal}
      />

      <UnsavedChangesModal
        isOpen={unsavedModal.isOpen}
        trainName={currentTrainName || ''}
        onSave={handleUnsavedSave}
        onDiscard={handleUnsavedDiscard}
        onCancel={() => setUnsavedModal({ isOpen: false, pendingTrainId: null })}
      />
    </div>
  );
}
