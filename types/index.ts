import { z } from 'zod';

// ========== CORE TYPES ==========

export interface Item {
  id: string;
  name: string;
  loopTime: number;           // minutes
  requiredParts: number;      // parts per minute
  stackSize: number;          // integer >=1
  imageData: string | null;   // Base64 or null
  freightCars: number;        // calculated, rounded up
}

export interface ItemFormData {
  name: string;
  loopTime: number;
  requiredParts: number;
  stackSize: number;
  imageData: string | null;
}

export interface ModalState {
  isOpen: boolean;
  mode: 'add' | 'edit';
  editingItemId: string | null;
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
  loopTime: z.number().positive('Loop time must be greater than 0'),
  requiredParts: z.number().positive('Required parts must be greater than 0'),
  stackSize: z.number().int().min(1, 'Stack size must be at least 1'),
  imageData: z.string().nullable(),
});

export const imageFileSchema = z.object({
  size: z.number().max(500 * 1024, 'Image size must be less than 500KB'),
  type: z.enum(['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'], {
    message: 'Please select a valid image file (PNG, JPG, GIF, or WebP)'
  }),
});

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