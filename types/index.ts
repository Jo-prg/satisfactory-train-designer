import { z } from 'zod';
import { BeltTier, SUPPORTED_STACK_SIZES, StackSize, CarType } from '../lib/constants';

// ========== CORE TYPES ==========

export interface Item {
  id: string;
  name: string;
  carType: CarType;           // freight or fluid
  loopTime?: number;          // minutes (optional, for future advanced mode)
  requiredParts: number;      // parts per minute (or m³/min for fluids)
  stackSize: StackSize;       // 50, 100, 200, or 500 (only for freight)
  beltTier: BeltTier;         // mk5 or mk6 (only for freight)
  imageData: string | null;   // Base64 or null
  freightCars: number;        // calculated, rounded up
}

export interface ItemFormData {
  name: string;
  carType: CarType;
  loopTime?: number;          // optional, hidden from UI for now
  requiredParts: number;
  stackSize: StackSize;
  beltTier: BeltTier;
  imageData: string | null;
}

export interface Train {
  id: string;
  name: string;
  items: Item[];
  createdAt: number;
  updatedAt: number;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingItemId: string | null;
}

export interface SaveTrainModalState {
  isOpen: boolean;
  mode: 'save' | 'rename';
  trainId?: string;
}

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export type FormErrors = {
  [K in keyof ItemFormData]?: string;
};

// ========== ZOD SCHEMAS ==========

export const itemFormSchema = z.object({
  name: z.string().min(1, 'Item name is required').trim(),
  carType: z.enum(['freight', 'fluid'], {
    message: 'Car type must be freight or fluid'
  }),
  loopTime: z.number().positive('Loop time must be greater than 0').optional(),
  requiredParts: z.number().positive('Required parts must be greater than 0'),
  stackSize: z.number().refine(
    (val) => [50, 100, 200, 500].includes(val),
    { message: 'Stack size must be 50, 100, 200, or 500' }
  ),
  beltTier: z.enum(['mk5', 'mk6'], {
    message: 'Belt tier must be mk5 or mk6'
  }),
  imageData: z.string().nullable(),
});

export const imageFileSchema = z.object({
  size: z.number().max(500 * 1024, 'Image size must be less than 500KB'),
  type: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'], {
    message: 'Please select a valid image file (PNG, JPG, GIF, or WebP)'
  }),
});

export const trainNameSchema = z.string()
  .min(1, 'Train name is required')
  .max(50, 'Train name must be 50 characters or less')
  .trim();

// ========== COMPONENT PROPS ==========

export interface ItemCardProps {
  item: Item;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface ItemListProps {
  items: Item[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export interface ItemModalProps {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingItemId: string | null;
  onClose: () => void;
  onSave: (data: ItemFormData) => void;
  items: Item[];
}

export interface ItemFormProps {
  mode: 'add' | 'edit';
  initialData?: ItemFormData;
  onSubmit: (data: ItemFormData) => void;
  onCancel: () => void;
}

export interface FreightCarProps {
  item: Item;
  color: string;
}

export interface LocomotiveProps {
  position: 'front' | 'back';
}

export interface TrainVisualizationProps {
  items: Item[];
  onReorder?: (fromIndex: number, toIndex: number) => void;
}

export interface FormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
}

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon';
  children: React.ReactNode;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export interface ImageUploadFieldProps {
  value: File | null;
  preview: string | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export interface EmptyStateProps {
  message?: string;
}



export interface BadgeProps {
  value: number;
  label: string;
}

export interface TrainListItemProps {
  train: Train;
  isActive: boolean;
  onClick: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export interface TrainSidebarProps {
  trains: Train[];
  activeTrainId: string | null;
  onSelectTrain: (id: string) => void;
  onNewTrain: () => void;
  onRenameTrain: (id: string) => void;
  onDeleteTrain: (id: string) => void;
  onReorderTrains?: (fromIndex: number, toIndex: number) => void;
  hasUnsavedChanges: boolean;
}

export interface SaveTrainModalProps {
  isOpen: boolean;
  mode: 'save' | 'rename';
  currentName?: string;
  existingNames: string[];
  onClose: () => void;
  onSave: (name: string) => void;
}

export interface UnsavedChangesModalProps {
  isOpen: boolean;
  trainName: string;
  onSave: () => void;
  onDiscard: () => void;
  onCancel: () => void;
}
