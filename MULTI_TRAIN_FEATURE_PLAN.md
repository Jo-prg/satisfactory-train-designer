# Multi-Train Sidebar Feature Plan

## Overview
Add ability to save multiple trains with names and switch between them using a left sidebar.

## Data Model Changes

### New Types (types/index.ts)
```typescript
export interface Train {
  id: string;
  name: string;
  items: Item[];
  createdAt: number;
  updatedAt: number;
}

export interface SaveTrainModalProps {
  isOpen: boolean;
  mode: 'save' | 'rename';
  currentName?: string;
  onClose: () => void;
  onSave: (name: string) => void;
}

export interface TrainListItemProps {
  train: Train;
  isActive: boolean;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}
```

### Updated Storage Structure
**Before:** `satisfactory_train_items` → `Item[]`  
**After:** 
- `satisfactory_trains` → `Train[]`
- `satisfactory_active_train_id` → `string | null`

## Architecture Changes

### State Management
**Current:**
```tsx
const { items, addItem, updateItem, deleteItem } = useItems();
```

**New:**
```tsx
const { 
  trains, 
  activeTrainId, 
  activeItems,
  saveCurrentTrain,
  loadTrain,
  createNewTrain,
  renameTrain,
  deleteTrain,
  addItemToActiveTrain,
  updateItemInActiveTrain,
  deleteItemFromActiveTrain
} = useTrains();
```

## New Components

### 1. TrainSidebar (`components/trains/TrainSidebar.tsx`)
**Purpose:** Left sidebar showing all saved trains  
**Features:**
- List of saved trains
- "New Train" button at top
- Active train highlighted
- Scroll if many trains
- Collapse/expand capability (future)

**Props:**
```typescript
interface TrainSidebarProps {
  trains: Train[];
  activeTrainId: string | null;
  onSelectTrain: (id: string) => void;
  onNewTrain: () => void;
  onRenameTrain: (id: string) => void;
  onDeleteTrain: (id: string) => void;
  hasUnsavedChanges: boolean;
}
```

### 2. TrainListItem (`components/trains/TrainListItem.tsx`)
**Purpose:** Individual train item in sidebar  
**Features:**
- Train name display
- Active state indicator
- Item count badge
- Freight car count badge
- Edit (rename) button
- Delete button with confirmation
- Timestamp (last updated)

### 3. SaveTrainModal (`components/trains/SaveTrainModal.tsx`)
**Purpose:** Modal for saving/renaming trains  
**Features:**
- Required name input field
- Validation (non-empty, unique names)
- Save/Cancel buttons
- Shows item count preview
- Error messages for validation

### 4. UnsavedChangesModal (`components/trains/UnsavedChangesModal.tsx`)
**Purpose:** Warning when switching trains with unsaved changes  
**Features:**
- Warning message
- Save, Discard, Cancel options
- Shows current train name

## New Hooks

### useTrains (`hooks/useTrains.ts`)
**Purpose:** Manage multiple trains and active train state  
**Responsibilities:**
- Load trains from localStorage
- Track active train
- CRUD operations on trains
- Track unsaved changes
- Auto-save or prompt for save

**Key Methods:**
```typescript
{
  trains: Train[];
  activeTrainId: string | null;
  activeItems: Item[];
  hasUnsavedChanges: boolean;
  
  // Train operations
  saveCurrentTrain: (name: string) => void;
  loadTrain: (id: string) => void;
  createNewTrain: () => void;
  renameTrain: (id: string, newName: string) => void;
  deleteTrain: (id: string) => void;
  
  // Item operations (on active train)
  addItem: (data: ItemFormData) => void;
  updateItem: (id: string, data: ItemFormData) => void;
  deleteItem: (id: string) => void;
  getItem: (id: string) => Item | null;
}
```

## UI/UX Flow

### 1. Initial State
- App loads with no saved trains OR last active train
- If no trains: show empty state with "Create your first train"
- If has trains: load last active train or first train

### 2. Working with Items
- User adds/edits/deletes items on current train (unsaved)
- Header/button shows "Save Train" or "Save Changes"
- Unsaved indicator (dot, asterisk, etc.)

### 3. Saving a Train
**New Train:**
1. User clicks "Save Train"
2. SaveTrainModal opens
3. User enters name (required, validated)
4. Train saved to localStorage
5. Train appears in sidebar
6. Train becomes active
7. Unsaved changes cleared

**Existing Train:**
1. User makes changes to loaded train
2. User clicks "Save Changes"
3. Train updated in localStorage
4. Unsaved indicator cleared

### 4. Switching Trains
**With Unsaved Changes:**
1. User clicks different train in sidebar
2. UnsavedChangesModal appears
3. Options: Save, Discard, Cancel
4. Based on choice: save then switch, discard and switch, or stay

**Without Unsaved Changes:**
1. User clicks different train
2. Train loads immediately
3. Items update in main view

### 5. Creating New Train
1. User clicks "New Train" in sidebar
2. If unsaved changes: prompt to save
3. Items cleared
4. Empty state shown
5. User adds items
6. User saves with name

### 6. Renaming Train
1. User clicks edit/rename button
2. SaveTrainModal opens in rename mode
3. Current name pre-filled
4. User enters new name
5. Train renamed in sidebar and storage

### 7. Deleting Train
1. User clicks delete button
2. Confirmation modal appears
3. If confirmed: train deleted
4. If was active: switch to another train or create new

## Layout Changes

### app/page.tsx Structure
```tsx
<div className={styles.appLayout}>
  <TrainSidebar 
    trains={trains}
    activeTrainId={activeTrainId}
    hasUnsavedChanges={hasUnsavedChanges}
    {...handlers}
  />
  
  <div className={styles.mainContent}>
    <header>
      <h1>Satisfactory Train Designer</h1>
      {activeTrainId && (
        <div className={styles.trainInfo}>
          <span className={styles.trainName}>
            {currentTrainName}
            {hasUnsavedChanges && <span className={styles.unsavedDot}>●</span>}
          </span>
          <Button onClick={handleSaveTrain}>
            {activeTrainId ? 'Save Changes' : 'Save Train'}
          </Button>
        </div>
      )}
    </header>
    
    <Button onClick={handleAddClick}>
      <Plus /> Add an item
    </Button>
    
    <ItemList items={activeItems} {...handlers} />
    
    <TrainVisualization items={activeItems} />
  </div>
  
  <SaveTrainModal {...trainModalProps} />
  <UnsavedChangesModal {...unsavedModalProps} />
  <ItemModal {...itemModalProps} />
</div>
```

### CSS Layout (app/page.module.css)
```css
.appLayout {
  display: flex;
  height: 100vh;
}

.sidebar {
  width: 280px;
  background: var(--surface-color);
  border-right: 1px solid var(--border-color);
  overflow-y: auto;
}

.mainContent {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
}
```

## Migration Strategy

### Phase 1: Data Migration Utility
Create migration function to convert old storage to new format:
```typescript
function migrateToTrains() {
  const oldItems = localStorage.getItem('satisfactory_train_items');
  if (oldItems) {
    const items = JSON.parse(oldItems);
    const defaultTrain: Train = {
      id: generateTrainId(),
      name: 'My First Train',
      items,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    localStorage.setItem('satisfactory_trains', JSON.stringify([defaultTrain]));
    localStorage.setItem('satisfactory_active_train_id', defaultTrain.id);
    localStorage.removeItem('satisfactory_train_items');
  }
}
```

### Phase 2: Implementation Order
1. ✅ Create new types in types/index.ts
2. ✅ Create lib/trainStorage.ts utility
3. ✅ Create lib/generateTrainId.ts
4. ✅ Create hooks/useTrains.ts
5. ✅ Create components/trains/TrainListItem.tsx + CSS
6. ✅ Create components/trains/TrainSidebar.tsx + CSS
7. ✅ Create components/trains/SaveTrainModal.tsx + CSS
8. ✅ Create components/trains/UnsavedChangesModal.tsx + CSS
9. ✅ Update app/page.tsx to use useTrains
10. ✅ Update app/page.module.css for layout
11. ✅ Add migration logic on app load
12. ✅ Test all workflows
13. ✅ Update tests

## Validation Rules

### Train Name Validation
- Required (non-empty after trim)
- Minimum 1 character
- Maximum 50 characters
- Unique across all trains
- No special characters that could break storage/display (optional)

### Train Operations Validation
- Cannot delete last train (or prompt to create new)
- Cannot switch trains without handling unsaved changes
- Cannot have duplicate train names

## Edge Cases to Handle

1. **No trains exist:** Show welcome/empty state
2. **All trains deleted:** Auto-create new empty train
3. **Active train deleted:** Switch to first available or create new
4. **Rapid train switching:** Debounce or queue operations
5. **Storage quota exceeded:** Show error, suggest deleting trains
6. **Corrupted train data:** Graceful error handling, skip corrupted trains
7. **Very long train names:** Truncate in display with ellipsis
8. **Many trains (100+):** Virtual scrolling or pagination in sidebar

## Future Enhancements (Not in Initial Scope)
- Train duplication
- Train export/import (JSON)
- Train search/filter in sidebar
- Train sorting (name, date, item count)
- Train tags/categories
- Train sharing via URL
- Undo/redo functionality
- Keyboard shortcuts (Ctrl+S to save, etc.)
- Drag-and-drop train reordering
- Train templates
- Bulk operations

## Testing Strategy

### Unit Tests
- useTrains hook operations
- Train name validation
- Train ID generation
- Storage migration logic

### Integration Tests
- Save new train flow
- Load train flow
- Switch train with unsaved changes
- Rename train flow
- Delete train flow

### Manual Testing Checklist
- [ ] Create first train
- [ ] Save train with valid name
- [ ] Try saving with empty name (should fail)
- [ ] Try saving with duplicate name (should fail)
- [ ] Switch between trains
- [ ] Edit items and save changes
- [ ] Switch train with unsaved changes
- [ ] Rename train
- [ ] Delete train (not last one)
- [ ] Delete second-to-last train
- [ ] Create 10+ trains and test scrolling
- [ ] Test with no trains (empty state)
- [ ] Test localStorage migration
- [ ] Test storage quota limits

## Success Criteria
- ✅ Users can save multiple named trains
- ✅ Train names are required and validated
- ✅ Sidebar shows all saved trains
- ✅ Clicking train loads it for editing
- ✅ Unsaved changes are tracked and prompted
- ✅ All train list operations work (create, rename, delete)
- ✅ Existing users' data is migrated automatically
- ✅ No data loss during operations
- ✅ Performance remains good with 20+ trains
- ✅ All tests pass with increased coverage
