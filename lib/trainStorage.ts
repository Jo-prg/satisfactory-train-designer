import type { Train } from '@/types';

const TRAINS_STORAGE_KEY = 'satisfactory_trains';
const ACTIVE_TRAIN_ID_KEY = 'satisfactory_active_train_id';

export function getTrains(): Train[] {
  try {
    const data = localStorage.getItem(TRAINS_STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading trains from localStorage:', error);
    return [];
  }
}

export function saveTrains(trains: Train[]): void {
  try {
    localStorage.setItem(TRAINS_STORAGE_KEY, JSON.stringify(trains));
  } catch (error) {
    console.error('Error saving trains to localStorage:', error);
    throw error;
  }
}

export function getActiveTrainId(): string | null {
  try {
    return localStorage.getItem(ACTIVE_TRAIN_ID_KEY);
  } catch (error) {
    console.error('Error loading active train ID:', error);
    return null;
  }
}

export function setActiveTrainId(id: string | null): void {
  try {
    if (id) {
      localStorage.setItem(ACTIVE_TRAIN_ID_KEY, id);
    } else {
      localStorage.removeItem(ACTIVE_TRAIN_ID_KEY);
    }
  } catch (error) {
    console.error('Error saving active train ID:', error);
  }
}

export function migrateOldItemsToTrains(): void {
  const OLD_ITEMS_KEY = 'satisfactory_train_items';
  
  try {
    // Check if migration already happened
    const existingTrains = getTrains();
    if (existingTrains.length > 0) {
      return; // Already migrated
    }
    
    // Check for old items
    const oldItemsData = localStorage.getItem(OLD_ITEMS_KEY);
    if (!oldItemsData) {
      return; // No old data to migrate
    }
    
    const oldItems = JSON.parse(oldItemsData);
    if (!Array.isArray(oldItems) || oldItems.length === 0) {
      return;
    }
    
    // Create migration train
    const migrationTrain: Train = {
      id: `train-${Date.now()}-migration`,
      name: 'My First Train',
      items: oldItems,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    
    // Save migrated train
    saveTrains([migrationTrain]);
    setActiveTrainId(migrationTrain.id);
    
    // Remove old data
    localStorage.removeItem(OLD_ITEMS_KEY);
    
    console.log('Successfully migrated old items to train:', migrationTrain.name);
  } catch (error) {
    console.error('Error during migration:', error);
  }
}
