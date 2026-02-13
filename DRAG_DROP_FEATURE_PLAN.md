# Drag & Drop Reordering Feature Plan

## Overview
Add drag & drop functionality to reorder freight cars in the train visualization, allowing users to customize the order of items in their train.

## Goals
- Allow users to reorder items in the train by dragging freight cars
- Provide visual feedback during drag operations
- Support both mouse and touch interactions
- Maintain accessibility standards
- Mark train as having unsaved changes when reordered

## Technical Approach

### Library Selection: @dnd-kit/core
**Why @dnd-kit:**
- Modern, performant, and actively maintained
- Built-in accessibility features (keyboard navigation)
- Touch/mobile support out of the box
- Customizable and flexible
- Better TypeScript support than react-beautiful-dnd
- Smaller bundle size
- Works with React 19

**Alternatives Considered:**
- ❌ react-beautiful-dnd: Not updated for React 18+, deprecated
- ❌ Native HTML5 Drag & Drop API: Poor mobile support, accessibility issues
- ✅ @dnd-kit/core: Best modern choice

### Dependencies to Install
```bash
npm install @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities
```

**Package Details:**
- `@dnd-kit/core` - Core drag & drop functionality
- `@dnd-kit/sortable` - Sortable list utilities and hooks
- `@dnd-kit/utilities` - CSS utilities for transforms

## Data Model Changes

### Current Item Storage
Items are stored in an array with no explicit ordering:
```typescript
interface Train {
  id: string;
  name: string;
  items: Item[];  // Order based on insertion
  createdAt: number;
  updatedAt: number;
}
```

### Option 1: Implicit Order (Recommended)
Keep array order as-is, reorder items in array when dragging:
```typescript
// No schema changes needed
// Array index = display order
```

**Pros:**
- No data migration needed
- Simpler implementation
- Backward compatible

**Cons:**
- Relies on array order
- No way to distinguish "never sorted" vs "sorted to this order"

### Option 2: Explicit Order Property
Add explicit `order` field to each item:
```typescript
interface Item {
  id: string;
  name: string;
  // ... other fields
  order?: number;  // Display order (optional for backward compat)
}
```

**Pros:**
- Explicit ordering
- Can detect if user has customized order
- Allows for future features (auto-sort, reset to default)

**Cons:**
- Requires data migration
- More complex to maintain
- Need to recalculate order indices on add/remove

**Decision:** Use Option 1 (Implicit Order) for initial implementation. Can add explicit ordering later if needed.

## Component Architecture

### Components to Modify

#### 1. TrainVisualization.tsx
**Current:** Renders locomotives and freight cars in array order  
**Changes:**
- Wrap in `DndContext` provider
- Handle `onDragEnd` event
- Reorder items array based on drag result
- Add visual indicators (drop zones, dragging state)

#### 2. FreightCar.tsx
**Current:** Static display of freight car  
**Changes:**
- Wrap in `useSortable` hook
- Add drag handle area
- Apply transform styles during drag
- Show dragging state (opacity, elevation)
- Add keyboard navigation support

#### 3. New Component: TrainCarriage.tsx (Optional)
**Purpose:** Wrapper around FreightCar with drag functionality  
**Benefit:** Keeps FreightCar.tsx clean, separates concerns

### Implementation Approach

#### Approach A: Direct Integration (Recommended for Phase 1)
Modify FreightCar directly to be draggable:

```tsx
// FreightCar.tsx
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function FreightCar({ item, color, index }) {
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

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <div className="dragHandle" {...listeners}>
        {/* Drag handle icon */}
      </div>
      {/* Existing freight car content */}
    </div>
  );
}
```

#### Approach B: Wrapper Component (Future Enhancement)
Create separate wrapper for better separation:

```tsx
// DraggableFreightCar.tsx
export function DraggableFreightCar({ item, color, index }) {
  const { ... } = useSortable({ id: item.id });
  
  return (
    <div ref={setNodeRef} {...}>
      <FreightCar item={item} color={color} />
    </div>
  );
}
```

**Decision:** Use Approach A initially, can refactor to B if needed.

## Visual Design

### Drag States

1. **Idle State**
   - Cursor: `grab` on hover over drag handle
   - Visual: Subtle grab icon (⋮⋮ or ≡)
   - Position: Top-left or center of freight car

2. **Dragging State**
   - Cursor: `grabbing`
   - Opacity: 50%
   - Elevation: Increased shadow
   - Scale: Slightly larger (1.05x)
   - Transform: Follow cursor smoothly

3. **Drop Target State**
   - Show insertion indicator line
   - Highlight valid drop zone
   - Shift other items to make space

4. **Invalid Drop State**
   - Red tint or strikethrough
   - Cursor: `not-allowed`
   - Visual feedback that drop won't work

### Drag Handle Design

**Option 1: Grip Icon**
```
┌─────────────┐
│ ⋮⋮          │
│   [Car]     │
│             │
└─────────────┘
```

**Option 2: Full Card Draggable**
```
┌─────────────┐
│   [Car]     │  <- Entire card is drag handle
│             │     with cursor: grab
└─────────────┘
```

**Decision:** Option 1 - Explicit drag handle for better UX clarity

### Animation Details
- **Drag Start:** 150ms ease-out
- **Drag Move:** Instant follow cursor, smooth transitions for other items
- **Drop:** 200ms ease-in-out snap to position
- **Reorder Shift:** 250ms ease-in-out for items making space

## User Experience Flow

### Desktop (Mouse) Flow
1. Hover over drag handle → Cursor changes to `grab`
2. Click and hold → Cursor changes to `grabbing`, item becomes semi-transparent
3. Drag → Item follows cursor, other items shift to show drop position
4. Release → Item animates to new position, train marked as unsaved
5. Undo option → Toast/snackbar with "Undo reorder" button (optional)

### Mobile (Touch) Flow
1. Long press on drag handle → Haptic feedback (vibration)
2. Item lifts with elevation increase
3. Drag → Item follows finger, other items shift
4. Release → Item drops, haptic feedback on drop
5. Simplified animations for performance

### Keyboard Flow (Accessibility)
1. Tab to drag handle
2. Press Space/Enter to "pick up" item
3. Arrow keys (←/→) to move position
4. Space/Enter to "drop" item
5. Escape to cancel drag
6. Screen reader announces: "Item moved from position X to position Y"

## State Management

### Local State in TrainVisualization
```typescript
const [items, setItems] = useState<Item[]>(train.items);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  
  if (over && active.id !== over.id) {
    setItems((items) => {
      const oldIndex = items.findIndex((i) => i.id === active.id);
      const newIndex = items.findIndex((i) => i.id === over.id);
      
      return arrayMove(items, oldIndex, newIndex);
    });
    
    // Mark train as having unsaved changes
    markAsUnsaved();
  }
};
```

### Syncing with useTrains Hook
```typescript
// In useTrains hook, add:
const reorderItems = useCallback((newOrder: Item[]) => {
  setCurrentItems(newOrder);
  setHasUnsavedChanges(true);
}, []);
```

### Persistence
- **Immediate:** Update local state immediately for instant feedback
- **Not Saved:** Don't save to localStorage until user clicks "Save Changes"
- **Unsaved Indicator:** Show unsaved changes dot (●) after reordering

## Implementation Phases

### Phase 1: Basic Functionality (MVP)
- [x] Install @dnd-kit packages
- [ ] Add DndContext to TrainVisualization
- [ ] Make FreightCar draggable with useSortable
- [ ] Implement basic reorder logic
- [ ] Add drag handle icon
- [ ] Mark as unsaved on reorder
- [ ] Test basic drag & drop

### Phase 2: Visual Polish
- [ ] Add dragging state styles (opacity, elevation)
- [ ] Add smooth animations
- [ ] Add drop zone indicators
- [ ] Add drag handle hover effects
- [ ] Test animations on different screen sizes

### Phase 3: Accessibility & Mobile
- [ ] Implement keyboard navigation
- [ ] Add ARIA labels and announcements
- [ ] Test with screen readers
- [ ] Add touch/mobile support
- [ ] Add haptic feedback (mobile)
- [ ] Test on mobile devices

### Phase 4: Enhanced UX (Future)
- [ ] Undo/redo functionality
- [ ] Drag multiple items at once
- [ ] Auto-scroll when dragging near edges
- [ ] Reset to default order option
- [ ] Snap to grid or alignment guides
- [ ] Preview mode showing before/after

## Edge Cases to Handle

### 1. Single Item
- **Issue:** No need to reorder if only one item
- **Solution:** Disable/hide drag handles if items.length === 1

### 2. Empty Train
- **Issue:** No items to reorder
- **Solution:** N/A - no drag handles shown

### 3. Rapid Reordering
- **Issue:** Multiple rapid drags could cause race conditions
- **Solution:** Debounce or queue reorder operations

### 4. Drag Outside Bounds
- **Issue:** User drags item completely off the train area
- **Solution:** Cancel drag and return item to original position

### 5. Browser Back Button
- **Issue:** User reorders, then clicks back before saving
- **Solution:** Unsaved changes modal should trigger

### 6. Concurrent Editing
- **Issue:** Two tabs open, reorder in one
- **Solution:** Out of scope for now (localStorage doesn't sync between tabs)

### 7. Very Long Trains (20+ items)
- **Issue:** Performance degradation with many items
- **Solution:** 
  - Virtual scrolling (future enhancement)
  - Optimize animations
  - Use CSS transforms instead of layout shifts

## Accessibility Requirements

### WCAG 2.1 AA Compliance

1. **Keyboard Navigation**
   - All drag operations must be keyboard accessible
   - Clear focus indicators
   - Logical tab order

2. **Screen Reader Support**
   - Announce drag start: "Picked up item X"
   - Announce position changes: "Item moved from position 2 to position 5"
   - Announce drop: "Item dropped"
   - Instructions: "Press space to pick up, arrow keys to move, space to drop"

3. **Focus Management**
   - Maintain focus on dragged item
   - Return focus after drop
   - Don't trap keyboard focus

4. **Color Contrast**
   - Drag handles have 4.5:1 contrast ratio
   - Drop indicators visible to all users
   - Don't rely solely on color for feedback

## Performance Considerations

### Optimization Strategies

1. **CSS Transforms**
   - Use `transform: translate()` instead of `left/top`
   - Hardware accelerated animations
   - Will-change property for elements being dragged

2. **Memoization**
   - Memoize freight car components with React.memo
   - Use useMemo for heavy calculations
   - Avoid re-rendering unchanged cars

3. **Throttling**
   - Throttle drag move events to 60fps max
   - Debounce expensive operations

4. **Lazy Rendering**
   - For very long trains (future), virtualize list
   - Render only visible + buffer items

### Performance Targets
- **Drag Start:** < 16ms (60fps)
- **Drag Move:** < 16ms per frame
- **Drop Animation:** Complete in < 300ms
- **Memory:** No memory leaks on repeated drags

## Testing Strategy

### Unit Tests
```typescript
describe('TrainVisualization drag & drop', () => {
  it('should reorder items when dragged', () => {});
  it('should mark train as unsaved after reorder', () => {});
  it('should handle drag cancel', () => {});
  it('should preserve item data during reorder', () => {});
});
```

### Integration Tests
- Test full drag & drop flow
- Test with keyboard navigation
- Test mobile touch interactions
- Test undo functionality

### Manual Testing Checklist
- [ ] Drag items with mouse
- [ ] Drag items with touch (mobile)
- [ ] Reorder with keyboard
- [ ] Test on Chrome, Firefox, Safari, Edge
- [ ] Test on iOS Safari, Chrome Mobile
- [ ] Test with screen reader (NVDA/JAWS/VoiceOver)
- [ ] Test with 1, 2, 5, 10, 20+ items
- [ ] Test drag near edge of container (auto-scroll)
- [ ] Verify unsaved changes indicator appears
- [ ] Verify order persists after saving

### Accessibility Testing
- [ ] WAVE tool scan
- [ ] axe DevTools scan
- [ ] Keyboard only navigation test
- [ ] Screen reader test (all major platforms)
- [ ] Color blindness simulation
- [ ] High contrast mode testing

## Code Structure

### New Files
```
components/train/
  ├── TrainVisualization.tsx (modified)
  ├── FreightCar.tsx (modified)
  └── DragHandle.tsx (new)

hooks/
  └── useDragAndDrop.ts (new - optional helper hook)

lib/
  └── arrayUtils.ts (add arrayMove utility)
```

### Key Functions

```typescript
// arrayUtils.ts
export function arrayMove<T>(array: T[], from: number, to: number): T[] {
  const newArray = [...array];
  const [removed] = newArray.splice(from, 1);
  newArray.splice(to, 0, removed);
  return newArray;
}

// useDragAndDrop.ts (optional)
export function useDragAndDrop(items: Item[], onReorder: (items: Item[]) => void) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    // Reorder logic
  };

  return { sensors, handleDragEnd };
}
```

## Alternative: Drag from Item List

### Option: Drag from Item List to Reorder Train
Users could also drag items in the ItemList component (above train visualization) to reorder:

**Pros:**
- More intuitive for some users
- Clearer visual representation
- Can show item details during drag

**Cons:**
- Doesn't match mental model of "reordering train cars"
- Less visual/fun
- Harder to see result while dragging

**Decision:** Focus on train visualization drag first, add item list drag as future enhancement.

## Success Criteria

✅ **Functional:**
- Users can reorder freight cars by dragging
- Order is preserved in data model
- Changes trigger unsaved indicator
- Order persists after save

✅ **UX:**
- Smooth, responsive animations
- Clear visual feedback during drag
- Intuitive drag handles
- Works on desktop and mobile

✅ **Accessibility:**
- Full keyboard navigation support
- Screen reader compatible
- WCAG 2.1 AA compliant
- Focus management correct

✅ **Performance:**
- No jank during drag operations
- Handles 20+ items smoothly
- No memory leaks

## Future Enhancements (Out of Scope)

- Drag & drop between different trains
- Multi-select and drag multiple items
- Undo/redo stack
- Snap to optimal order (by size, type, etc.)
- Drag to delete (drag off train to remove)
- Animated preview of train movement
- Bulk reorder operations (sort alphabetically, by freight cars, etc.)
- Touch gestures (swipe to reorder)
- Drag handles with custom icons/colors
- Train "templates" with saved orders

## Questions to Resolve

1. **Should locomotives be draggable?**
   - **Proposal:** No - locomotives always at ends
   - **Rationale:** Maintains train realism, simpler UX

2. **Should reordering be instant or require save?**
   - **Proposal:** Instant visual update, but requires save to persist
   - **Rationale:** Best of both - instant feedback, intentional persistence

3. **Show order numbers on freight cars?**
   - **Proposal:** Optional - show on hover or when dragging
   - **Rationale:** Useful for debugging, but clutters UI normally

4. **Allow dragging across train visualization sections?**
   - **Proposal:** Yes - single contiguous drag area
   - **Rationale:** Simpler interaction model

## Dependencies

### NPM Packages
```json
{
  "@dnd-kit/core": "^6.1.0",
  "@dnd-kit/sortable": "^8.0.0",
  "@dnd-kit/utilities": "^3.2.2"
}
```

### Bundle Size Impact
- @dnd-kit/core: ~30KB gzipped
- @dnd-kit/sortable: ~5KB gzipped
- @dnd-kit/utilities: ~2KB gzipped
- **Total:** ~37KB (acceptable for this feature)

## Migration Notes

No data migration needed since we're using implicit array order. Existing trains will work as-is, with items maintaining their current order.

## Rollback Plan

If issues arise:
1. Feature flag to disable drag & drop
2. Fall back to static train visualization
3. Remove @dnd-kit packages if needed
4. No data loss - order preserved in array

## Documentation Updates

### User-Facing
- Add to README: "Drag freight cars to reorder your train"
- Add tooltip on first drag: "Drag to reorder cars"
- Add to help/FAQ section

### Developer-Facing
- Document drag & drop architecture
- Add code comments for reorder logic
- Update component documentation

## Implementation Timeline

- **Phase 1 (MVP):** 4-6 hours
- **Phase 2 (Polish):** 2-3 hours  
- **Phase 3 (Accessibility):** 3-4 hours
- **Testing:** 2-3 hours
- **Total:** ~12-16 hours

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Performance issues | Low | High | Profile early, optimize transforms |
| Accessibility gaps | Medium | High | Test with tools, follow @dnd-kit docs |
| Mobile touch issues | Low | Medium | Use @dnd-kit touch sensor, test early |
| Browser compatibility | Low | Low | @dnd-kit handles cross-browser |
| User confusion | Medium | Low | Clear drag handles, instructions |

## Open Questions for User

1. Should we show position numbers (1, 2, 3...) on cars?
2. Should there be a "Reset to default order" button?
3. Should we add an undo button after reordering?
4. Should the drag handle be visible always, or only on hover?
