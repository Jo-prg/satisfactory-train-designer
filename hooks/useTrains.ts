'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import type { Train, Item, ItemFormData } from '@/types';
import { getTrains, saveTrains, getActiveTrainId, setActiveTrainId, migrateOldItemsToTrains } from '@/lib/trainStorage';
import { generateTrainId } from '@/lib/generateTrainId';
import { generateItemId } from '@/lib/idGenerator';
import { calculateFreightCars } from '@/lib/calculations';
import { arrayMove } from '@/lib/arrayUtils';

export function useTrains() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [activeTrainId, setActiveTrainIdState] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [currentItems, setCurrentItems] = useState<Item[]>([]);
  const isInitialized = useRef(false);

  // Load trains and active train on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    // Run migration first
    migrateOldItemsToTrains();

    // Load trains
    const loadedTrains = getTrains();
    setTrains(loadedTrains);

    // Load active train
    const savedActiveId = getActiveTrainId();
    if (savedActiveId && loadedTrains.some(t => t.id === savedActiveId)) {
      setActiveTrainIdState(savedActiveId);
      const activeTrain = loadedTrains.find(t => t.id === savedActiveId);
      if (activeTrain) {
        setCurrentItems(activeTrain.items);
      }
    } else if (loadedTrains.length > 0) {
      // No saved active train, use first one
      setActiveTrainIdState(loadedTrains[0].id);
      setCurrentItems(loadedTrains[0].items);
      setActiveTrainId(loadedTrains[0].id);
    }
  }, []);

  // Update active train ID in storage
  const updateActiveTrainId = useCallback((id: string | null) => {
    setActiveTrainIdState(id);
    setActiveTrainId(id);
    setHasUnsavedChanges(false);
  }, []);

  // Save current working items to a train
  const saveCurrentTrain = useCallback((name: string, trainId?: string) => {
    const now = Date.now();
    
    if (trainId) {
      // Update existing train
      const updatedTrains = trains.map(t =>
        t.id === trainId
          ? { ...t, name, items: currentItems, updatedAt: now }
          : t
      );
      setTrains(updatedTrains);
      saveTrains(updatedTrains);
      updateActiveTrainId(trainId);
    } else {
      // Create new train
      const newTrain: Train = {
        id: generateTrainId(),
        name,
        items: currentItems,
        createdAt: now,
        updatedAt: now,
      };
      const updatedTrains = [...trains, newTrain];
      setTrains(updatedTrains);
      saveTrains(updatedTrains);
      updateActiveTrainId(newTrain.id);
    }
    
    setHasUnsavedChanges(false);
  }, [trains, currentItems, updateActiveTrainId]);

  // Load a train (switch to it)
  const loadTrain = useCallback((id: string) => {
    const train = trains.find(t => t.id === id);
    if (train) {
      setCurrentItems(train.items);
      updateActiveTrainId(id);
      setHasUnsavedChanges(false);
    }
  }, [trains, updateActiveTrainId]);

  // Create a new empty train
  const createNewTrain = useCallback(() => {
    setCurrentItems([]);
    updateActiveTrainId(null);
    setHasUnsavedChanges(false);
  }, [updateActiveTrainId]);

  // Rename a train
  const renameTrain = useCallback((id: string, newName: string) => {
    const updatedTrains = trains.map(t =>
      t.id === id
        ? { ...t, name: newName, updatedAt: Date.now() }
        : t
    );
    setTrains(updatedTrains);
    saveTrains(updatedTrains);
  }, [trains]);

  // Delete a train
  const deleteTrain = useCallback((id: string) => {
    const updatedTrains = trains.filter(t => t.id !== id);
    setTrains(updatedTrains);
    saveTrains(updatedTrains);

    // If deleting active train, switch to another or create new
    if (id === activeTrainId) {
      if (updatedTrains.length > 0) {
        const nextTrain = updatedTrains[0];
        setCurrentItems(nextTrain.items);
        updateActiveTrainId(nextTrain.id);
      } else {
        createNewTrain();
      }
    }
  }, [trains, activeTrainId, updateActiveTrainId, createNewTrain]);

  // Reorder trains in the sidebar
  const reorderTrains = useCallback((fromIndex: number, toIndex: number) => {
    const reordered = arrayMove(trains, fromIndex, toIndex);
    setTrains(reordered);
    saveTrains(reordered);
  }, [trains]);

  // Add item to current working items
  const addItem = useCallback((data: ItemFormData) => {
    const freightCars = calculateFreightCars(
      data.carType,
      data.requiredParts,
      data.carType === 'freight' ? data.stackSize : undefined,
      data.carType === 'freight' ? data.beltTier : undefined
    );

    const newItem: Item = {
      id: generateItemId(),
      name: data.name,
      carType: data.carType,
      loopTime: data.loopTime,
      requiredParts: data.requiredParts,
      stackSize: data.stackSize,
      beltTier: data.beltTier,
      imageData: data.imageData,
      freightCars,
    };

    setCurrentItems(prev => [...prev, newItem]);
    setHasUnsavedChanges(true);
    return newItem;
  }, []);

  // Update item in current working items
  const updateItem = useCallback((id: string, data: ItemFormData) => {
    const freightCars = calculateFreightCars(
      data.carType,
      data.requiredParts,
      data.carType === 'freight' ? data.stackSize : undefined,
      data.carType === 'freight' ? data.beltTier : undefined
    );

    setCurrentItems(prev =>
      prev.map(item =>
        item.id === id
          ? {
              ...item,
              name: data.name,
              carType: data.carType,
              loopTime: data.loopTime,
              requiredParts: data.requiredParts,
              stackSize: data.stackSize,
              beltTier: data.beltTier,
              imageData: data.imageData,
              freightCars,
            }
          : item
      )
    );
    setHasUnsavedChanges(true);
  }, []);

  // Delete item from current working items
  const deleteItem = useCallback((id: string) => {
    setCurrentItems(prev => prev.filter(item => item.id !== id));
    setHasUnsavedChanges(true);
  }, []);

  // Reorder items in current working items
  const reorderItems = useCallback((fromIndex: number, toIndex: number) => {
    setCurrentItems(prev => arrayMove(prev, fromIndex, toIndex));
    setHasUnsavedChanges(true);
  }, []);

  // Get item from current working items
  const getItem = useCallback((id: string): Item | null => {
    return currentItems.find(item => item.id === id) || null;
  }, [currentItems]);

  // Get current train name
  const getCurrentTrainName = useCallback((): string | null => {
    if (!activeTrainId) return null;
    const train = trains.find(t => t.id === activeTrainId);
    return train ? train.name : null;
  }, [activeTrainId, trains]);

  return {
    trains,
    activeTrainId,
    activeItems: currentItems,
    hasUnsavedChanges,
    
    // Train operations
    saveCurrentTrain,
    loadTrain,
    createNewTrain,
    renameTrain,
    deleteTrain,
    reorderTrains,
    getCurrentTrainName,
    
    // Item operations (on current working items)
    addItem,
    updateItem,
    deleteItem,
    reorderItems,
    getItem,
  };
}
