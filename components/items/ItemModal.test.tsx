import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ItemModal } from './ItemModal';
import type { Item } from '@/types';

describe('ItemModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();

  const mockItems: Item[] = [
    {
      id: '1',
      name: 'Iron Ore',
      requiredParts: 100,
      stackSize: 100,
      beltTier: 'mk5',
      imageData: null,
      freightCars: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render when isOpen is false', () => {
    render(
      <ItemModal
        isOpen={false}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    expect(screen.queryByText('Add Item')).not.toBeInTheDocument();
  });

  it('should render add modal when isOpen is true', () => {
    render(
      <ItemModal
        isOpen={true}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('should render edit modal with item data', () => {
    render(
      <ItemModal
        isOpen={true}
        mode="edit"
        editingItemId="1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={mockItems}
      />
    );

    expect(screen.getByText('Edit Item')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Iron Ore')).toBeInTheDocument();
  });

  it('should call onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    
    render(
      <ItemModal
        isOpen={true}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should not cause infinite loops when props change', () => {
    const { rerender } = render(
      <ItemModal
        isOpen={true}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    // Rerender multiple times with same props (but new array reference)
    rerender(
      <ItemModal
        isOpen={true}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    rerender(
      <ItemModal
        isOpen={true}
        mode="add"
        editingItemId={null}
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[]}
      />
    );

    // Should not crash with infinite loop
    expect(screen.getByText('Add Item')).toBeInTheDocument();
  });

  it('should not cause infinite loops with editing item', () => {
    const { rerender } = render(
      <ItemModal
        isOpen={true}
        mode="edit"
        editingItemId="1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={mockItems}
      />
    );

    // Rerender with same data (new array reference)
    const newItemsArray = [...mockItems];
    rerender(
      <ItemModal
        isOpen={true}
        mode="edit"
        editingItemId="1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={newItemsArray}
      />
    );

    rerender(
      <ItemModal
        isOpen={true}
        mode="edit"
        editingItemId="1"
        onClose={mockOnClose}
        onSave={mockOnSave}
        items={[...mockItems]}
      />
    );

    // Should not crash with infinite loop
    expect(screen.getByText('Edit Item')).toBeInTheDocument();
  });
});
