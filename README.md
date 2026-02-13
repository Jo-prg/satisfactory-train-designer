# Satisfactory Train Designer (Next.js + TypeScript)

A modern, modular web application to design and visualize train configurations for Satisfactory game logistics. Built with Next.js 14, TypeScript, and React.

## Features

- ✅ **Multi-Item Management**: Add, edit, and delete multiple cargo items
- ✅ **Type-Safe**: Full TypeScript coverage with Zod validation
- ✅ **Custom Images**: Upload images to display on freight cars (Base64 encoding)
- ✅ **Visual Train Builder**: Combined train visualization with color-coded freight cars
- ✅ **Persistent Storage**: Items saved to localStorage across sessions
- ✅ **Modular Architecture**: Component-based design with custom hooks
- ✅ **Responsive Design**: Works on desktop and mobile devices
- ✅ **Modern UI**: Clean interface with Lucide React icons

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: CSS Modules
- **Validation**: Zod schemas
- **Icons**: Lucide React
- **State Management**: Custom hooks with localStorage sync

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

Dependencies are already installed. If needed:
```bash
npm install
```

### Running the Development Server

**Windows PowerShell:**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
npm run dev
```

**macOS/Linux:**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. **Add Items**: Click "Add an item +" to create cargo items
2. **Fill Form**: Enter item name, loop time, required parts/min, stack size
3. **Upload Image** (optional): Select an image to display on freight cars
4. **Edit Items**: Click on any item card or the edit icon to modify
5. **Delete Items**: Click the trash icon and confirm deletion
6. **View Train**: Automatically visualized with calculated freight cars
7. **Persistence**: All data saved automatically to localStorage

## Calculation Formula

```
parts_per_train = loop_time × (required_parts × 2)
freight_cars = CEILING(parts_per_train ÷ (32 × stack_size))
```

## Project Structure

```
satisfactory-train-designer/
├── app/
│   ├── layout.tsx              # Root layout with metadata
│   ├── page.tsx                # Main page component
│   ├── globals.css             # Global styles
│   └── page.module.css         # Page-specific styles
├── components/
│   ├── ui/                     # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Modal.tsx
│   │   ├── FormField.tsx
│   │   ├── Badge.tsx
│   │   └── EmptyState.tsx
│   ├── items/                  # Item-related components
│   │   ├── ItemCard.tsx
│   │   ├── ItemList.tsx
│   │   ├── ItemForm.tsx
│   │   ├── ItemModal.tsx
│   │   └── ImageUploadField.tsx
│   └── train/                  # Train visualization
│       ├── TrainVisualization.tsx
│       ├── Locomotive.tsx
│       ├── FreightCar.tsx
│       └── TrainLegend.tsx
├── hooks/                      # Custom React hooks
│   ├── useLocalStorage.ts
│   ├── useModal.ts
│   ├── useImageUpload.ts
│   └── useItems.ts
├── lib/                        # Utilities & services
│   ├── calculations.ts
│   ├── storage.ts
│   ├── validation.ts
│   ├── imageUtils.ts
│   ├── colorUtils.ts
│   └── idGenerator.ts
├── types/
│   └── index.ts                # TypeScript type definitions & Zod schemas
└── public/
    ├── locomotive.svg          # Train engine image
    └── freightcar.svg          # Freight car base image
```

## Architecture Highlights

### Custom Hooks

- **useLocalStorage**: Syncs state with localStorage, handles SSR hydration
- **useModal**: Manages modal state (open/close/mode)
- **useImageUpload**: Handles file selection, preview, Base64 encoding
- **useItems**: CRUD operations for items with automatic persistence

### Type Safety

- Full TypeScript coverage
- Zod schemas for runtime validation
- Type-safe component props
- Strict mode enabled

### Modular Design

- Separated concerns (UI, business logic, utilities)
- Reusable components with CSS Modules
- Pure utility functions for calculations
- Custom hooks for state management

## Migration from Vanilla JS

This is a complete refactor of the original vanilla JavaScript train calculator:

**What Changed:**
- ✅ Converted to Next.js 14 with App Router
- ✅ Added full TypeScript support
- ✅ Implemented Zod validation
- ✅ Modular component architecture
- ✅ CSS Modules for scoped styling
- ✅ Custom hooks for state management
- ✅ Lucide React icons

**What Stayed the Same:**
- Same calculation formula
- Same features (add/edit/delete, image upload)
- Same visual design (purple/blue gradient theme)
- localStorage persistence
- Train visualization logic

## Data Storage

- **Key**: `satisfactory_train_items`
- **Format**: JSON array of Item objects
- **Image Storage**: Base64 encoded strings
- **Size Limit**: 500KB per image
- **Supported Formats**: PNG, JPG, GIF, WebP

## Browser Compatibility

- All modern browsers (Chrome, Firefox, Safari, Edge)
- Requires JavaScript enabled
- Requires localStorage support

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### TypeScript Configuration

- Strict mode enabled
- Path aliases: `@/*` points to root
- React 18+ with Next.js types

## Troubleshooting

### PowerShell Execution Policy Error

If you see "running scripts is disabled", run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

### Build Errors

Ensure all dependencies are installed:
```bash
npm install
```

### localStorage Not Persisting

- Check browser privacy settings
- Clear browser cache
- Ensure localStorage is enabled

## License

This project is open source and available for use with the Satisfactory game.

## Original Prototype

See `../Prototype/` for the original vanilla JavaScript implementation.
