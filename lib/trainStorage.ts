import type { Train, Item } from '@/types';
import { calculateFreightCarsRateBased } from './calculations';
import type { BeltTier, StackSize } from './constants';

const TRAINS_STORAGE_KEY = 'satisfactory_trains';
const ACTIVE_TRAIN_ID_KEY = 'satisfactory_active_train_id';

/**
 * Migrate items to include belt tier if missing
 * Adds beltTier: 'mk5' to items that don't have it and recalculates freight cars
 */
function migrateBeltTier(trains: Train[]): Train[] {
  let migrated = false;
  
  const migratedTrains = trains.map(train => {
    const migratedItems = train.items.map(item => {
      // Check if item is missing beltTier field
      if (!('beltTier' in item) || item.beltTier === undefined) {
        migrated = true;
        
        // Default to mk5 belt tier
        const beltTier: BeltTier = 'mk5';
        
        // Ensure stackSize is a valid StackSize (default to 100 if invalid)
        let stackSize: StackSize = 100;
        if ([50, 100, 200, 500].includes(item.stackSize)) {
          stackSize = item.stackSize as StackSize;
        }
        
        // Recalculate freight cars using rate-based model
        const freightCars = calculateFreightCarsRateBased(
          item.requiredParts,
          stackSize,
          beltTier
        );
        
        return {
          ...item,
          beltTier,
          stackSize,
          freightCars,
        };
      }
      
      return item;
    });
    
    return {
      ...train,
      items: migratedItems,
    };
  });
  
  if (migrated) {
    console.log('Migrated trains to include belt tier (defaulted to mk5)');
  }
  
  return migratedTrains;
}

export function getTrains(): Train[] {
  try {
    const data = localStorage.getItem(TRAINS_STORAGE_KEY);
    if (!data) return [];
    
    const trains = JSON.parse(data);
    
    // Migrate trains to include belt tier if needed
    const migratedTrains = migrateBeltTier(trains);
    
    // Save migrated data back if changes were made
    if (JSON.stringify(trains) !== JSON.stringify(migratedTrains)) {
      saveTrains(migratedTrains);
    }
    
    return migratedTrains;
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
