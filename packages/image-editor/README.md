# Image Editor Package

A React-based image editor built with Fabric.js for the OpenDov workspace.

## Features

- Canvas-based image editing
- Drawing tools (brush, pen, shapes)
- Text overlay support
- Image filters and effects
- **Advanced finetune adjustments** (brightness, contrast, saturation, exposure, temperature, gamma, clarity, vignette)
- Undo/redo functionality
- Export capabilities
- **NEW**: Advanced navbar system with finetune and filter features
- **NEW**: Independent navbar components using shared context
- **NEW**: Modular hooks architecture for better maintainability

## Architecture

The image editor now uses a modular hooks architecture that separates concerns into specialized hooks:

### Core Hooks Structure

```
src/hooks/
├── index.ts                    # Main hooks export
├── use-navbar.ts              # Navbar state management
└── use-image-editor/          # Modular image editor hooks
    ├── index.ts               # Export all specialized hooks
    ├── types.ts               # Shared type definitions
    ├── use-image-editor.ts    # Main orchestrator hook
    ├── use-canvas.ts          # Canvas management
    ├── use-finetune.ts        # Image finetune adjustments
    ├── use-image-upload.ts    # Image upload and loading
    ├── use-image-export.ts    # Image export functionality
    └── use-image-history.ts   # Undo/redo functionality
```

### Specialized Hooks

#### `useCanvas`
Manages canvas initialization, Fabric.js loading, and canvas dimensions.

```tsx
import { useCanvas } from '@workspace/image-editor/hooks/use-image-editor';

const { canvas, canvasRef, isFabricLoaded, canvasDimensions } = useCanvas(options);
```

#### `useFinetune`
Handles all image adjustment operations (brightness, contrast, saturation, etc.).

```tsx
import { useFinetune } from '@workspace/image-editor/hooks/use-image-editor';

const { finetuneValues, updateFinetuneValue, resetFinetune } = useFinetune(canvas);
```

#### `useImageUpload`
Manages image upload, loading, and validation.

```tsx
import { useImageUpload } from '@workspace/image-editor/hooks/use-image-editor';

const { hasImage, uploadImage, loadImage, clearImage } = useImageUpload(canvas, updateDimensions);
```

#### `useImageExport`
Handles image export and download functionality.

```tsx
import { useImageExport } from '@workspace/image-editor/hooks/use-image-editor';

const { save, downloadImage, getImageData } = useImageExport(canvas);
```

#### `useImageHistory`
Manages undo/redo functionality with state history.

```tsx
import { useImageHistory } from '@workspace/image-editor/hooks/use-image-editor';

const { undo, redo, canUndo, canRedo, saveState } = useImageHistory(canvas);
```

## Usage

### Basic Image Editor
```tsx
import { ImageEditor } from '@workspace/image-editor/components/image-editor';

function MyComponent() {
  return (
    <ImageEditor
      width={800}
      height={600}
      onSave={(dataUrl) => console.log('Image saved:', dataUrl)}
    />
  );
}
```

### Image Editor with Navbar System
```tsx
import { ClientImageEditorWithNavbar } from '@workspace/image-editor';

function MyComponent() {
  return (
    <ClientImageEditorWithNavbar
      width={800}
      height={600}
      onSave={(dataUrl) => console.log('Image saved:', dataUrl)}
    />
  );
}
```

### Using Individual Hooks
```tsx
import { 
  useImageEditor, 
  useCanvas, 
  useFinetune, 
  useImageUpload,
  useImageExport,
  useImageHistory 
} from '@workspace/image-editor';

function MyCustomEditor() {
  // Use the main orchestrator hook
  const editor = useImageEditor({ width: 800, height: 600 });
  
  // Or use individual hooks for specific functionality
  const canvas = useCanvas({ width: 800, height: 600 });
  const finetune = useFinetune(canvas.canvas);
  const upload = useImageUpload(canvas.canvas, canvas.updateCanvasDimensions);
  const export = useImageExport(canvas.canvas);
  const history = useImageHistory(canvas.canvas);
  
  return (
    <div>
      <canvas ref={canvas.canvasRef} />
      {/* Your custom UI */}
    </div>
  );
}
```

## Components

- `ImageEditor` - Basic editor component with context provider
- `ImageEditorWithNavbar` - Advanced editor with navbar system
- `ClientImageEditor` - Client-side wrapper for basic editor
- `ClientImageEditorWithNavbar` - Client-side wrapper for navbar editor
- `Toolbar` - Editing tools toolbar
- `Navbar` - Main sidebar navigation

## Context System

The image editor now uses a React context to share state across all navbar components:

### ImageEditorProvider
Wraps the editor and provides shared state to all child components.

### useImageEditorContext
Hook to access the shared image editor state from any navbar component.

```tsx
import { ImageEditorProvider, useImageEditorContext } from '@workspace/image-editor';

function MyCustomComponent() {
  const { hasImage, addText, clear } = useImageEditorContext();
  
  return (
    <div>
      {hasImage && (
        <button onClick={() => addText('Hello World')}>
          Add Text
        </button>
      )}
    </div>
  );
}

function MyApp() {
  return (
    <ImageEditorProvider options={{ width: 800, height: 600 }}>
      <MyCustomComponent />
    </ImageEditorProvider>
  );
}
```

## Hooks

### Main Hooks
- `useImageEditor` - Main orchestrator hook that combines all specialized hooks
- `useNavbar` - Custom hook for navbar state management
- `useImageEditorContext` - Hook to access shared editor state from context

### Specialized Hooks
- `useCanvas` - Canvas management and Fabric.js integration
- `useFinetune` - Image adjustment and filter management
- `useImageUpload` - Image upload, loading, and validation
- `useImageExport` - Image export and download functionality
- `useImageHistory` - Undo/redo with state history management

## Independent Navbar Components

All navbar components are now independent and use the shared context instead of receiving props. This makes them more maintainable and easier to use:

### Annotations Components
- `AnnotationsTopbar` - Independent top toolbar for annotations mode
- `AnnotationsBottom` - Independent bottom toolbar with annotation tools

### Finetune Components  
- `FinetuneTopbar` - Independent top toolbar for finetune mode
- `FinetuneBottom` - Independent bottom toolbar with adjustment sliders

### Filter Components
- `FilterTopbar` - Independent top toolbar for filter mode
- `FilterBottom` - Independent bottom toolbar with filter presets

### Using Independent Components
```tsx
import { 
  ImageEditorProvider, 
  AnnotationsTopbar, 
  AnnotationsBottom,
  FinetuneTopbar,
  FinetuneBottom 
} from '@workspace/image-editor';

function MyCustomEditor() {
  return (
    <ImageEditorProvider options={{ width: 800, height: 600 }}>
      <div className="flex h-screen">
        {/* Your custom layout */}
        <div className="flex-1 flex flex-col">
          <AnnotationsTopbar />
          {/* Canvas area */}
          <AnnotationsBottom />
        </div>
      </div>
    </ImageEditorProvider>
  );
}
```

## Annotations Functionality

The image editor includes comprehensive annotation tools for adding text, shapes, and managing images:

### Available Tools
- **Image Upload**: Upload and change images
- **Text Overlay**: Add editable text to images
- **Shape Tools**: Add rectangles, circles, and triangles
- **Clear Canvas**: Remove all content and start fresh

### Using Annotations in Custom Components
```tsx
import { useImageEditorContext } from '@workspace/image-editor';

function MyCustomEditor() {
  const {
    canvas,
    hasImage,
    addText,
    addShape,
    clear,
  } = useImageEditorContext();

  const handleAddText = () => {
    addText('Hello World');
  };

  const handleAddShape = () => {
    addShape('rect');
  };

  return (
    <div>
      {hasImage && (
        <div>
          <button onClick={handleAddText}>Add Text</button>
          <button onClick={handleAddShape}>Add Rectangle</button>
          <button onClick={clear}>Clear Canvas</button>
        </div>
      )}
    </div>
  );
}
```

## Finetune Functionality

The image editor now includes advanced finetune adjustments that work directly on the canvas:

### Available Adjustments
- **Brightness** (-100 to 100): Adjust image brightness
- **Contrast** (-100 to 100): Adjust image contrast
- **Saturation** (-100 to 100): Adjust color saturation
- **Exposure** (-100 to 100): Adjust exposure levels
- **Temperature** (-100 to 100): Warm (positive) or cool (negative) tones
- **Gamma** (-100 to 100): Adjust gamma correction
- **Clarity** (0 to 100): Enhance image sharpness
- **Vignette** (0 to 100): Add darkening around edges

### Recent Fixes
- **Fixed filter removal**: Filters now properly remove when values are reset to 0
- **Improved filter identification**: Each filter is now tagged with its adjustment type for reliable removal
- **Enhanced responsiveness**: Removed setTimeout delay for immediate filter application
- **Better debugging**: Added filter status tracking and debugging functions

### Using Finetune in Custom Components
```tsx
import { useImageEditorContext } from '@workspace/image-editor';

function MyCustomEditor() {
  const {
    canvas,
    hasImage,
    finetuneValues,
    updateFinetuneValue,
    resetFinetune,
    getFilterStatus, // New: Get current filter status
    refreshFilters,  // New: Manually refresh filters
  } = useImageEditorContext();

  const handleBrightnessChange = (value: number) => {
    updateFinetuneValue('brightness', value);
  };

  const handleReset = () => {
    resetFinetune();
  };

  // Debug: Log current filter status
  const logFilterStatus = () => {
    console.log('Current filters:', getFilterStatus());
  };

  return (
    <div>
      {hasImage && (
        <div>
          <label>Brightness: {finetuneValues.brightness}</label>
          <input
            type="range"
            min="-100"
            max="100"
            value={finetuneValues.brightness}
            onChange={(e) => handleBrightnessChange(Number(e.target.value))}
          />
          <button onClick={handleReset}>Reset All</button>
          <button onClick={logFilterStatus}>Debug Filters</button>
        </div>
      )}
    </div>
  );
}
```

## Navbar System

The navbar system provides three types of navigation:

### 1. Main Sidebar (Left)
- **Features**: Annotations, Filter, Finetune
- **Controls**: Reset, Save
- **Navigation**: Switch between editing features

### 2. Top Toolbar (Optional)
- **Controls**: Undo, Redo, Zoom In/Out, Done
- **Context**: Changes based on active feature

### 3. Bottom Toolbar (Optional)
- **Annotations Mode**: Image upload, text tools, shape tools, and clear functionality
- **Finetune Mode**: Interactive sliders for all finetune adjustments
- **Filter Mode**: Filter presets (Vintage, B&W, Sepia, etc.)

### Usage Example
```tsx
import { useNavbar } from '@workspace/image-editor';

function MyComponent() {
  const {
    activeFeature,
    setActiveFeature,
    isFeatureActive,
    showTopbar,
    showBottom,
  } = useNavbar({
    initialFeature: 'finetune',
    showTopbar: true,
    showBottom: true,
  });

  return (
    <div>
      <button onClick={() => setActiveFeature('finetune')}>
        Finetune
      </button>
      <button onClick={() => setActiveFeature('filter')}>
        Filter
      </button>
      
      {isFeatureActive('finetune') && (
        <div>
          {/* Finetune controls will be rendered here */}
        </div>
      )}
    </div>
  );
}
```

## Navbar Components

### Main Navigation
- `Navbar` - Main sidebar with feature switching

### Annotations Components
- `AnnotationsTopbar` - Top toolbar for annotations mode
- `AnnotationsBottom` - Bottom toolbar with annotation tools (upload, text, shapes, clear)

### Finetune Components
- `FinetuneTopbar` - Top toolbar for finetune mode
- `FinetuneBottom` - Bottom toolbar with adjustment sliders

### Filter Components
- `FilterTopbar` - Top toolbar for filter mode
- `FilterBottom` - Bottom toolbar with filter presets

## Type Definitions

The package exports comprehensive TypeScript types:

```tsx
import type {
  Tool,
  UseImageEditorOptions,
  FinetuneValues,
  CanvasDimensions,
  ImageEditorState,
  ImageUploadResult,
  FilterStatus,
  HistoryState
} from '@workspace/image-editor';
```

## Package Exports

The package provides granular exports for different use cases:

```tsx
// Main exports
import { ImageEditor, useImageEditor } from '@workspace/image-editor';

// Individual hooks
import { useCanvas } from '@workspace/image-editor/hooks/use-image-editor/use-canvas';
import { useFinetune } from '@workspace/image-editor/hooks/use-image-editor/use-finetune';

// Components
import { Toolbar } from '@workspace/image-editor/components/toolbar';
import { Navbar } from '@workspace/image-editor/components/navbar';

// Context
import { ImageEditorProvider, useImageEditorContext } from '@workspace/image-editor/contexts/image-editor-context';

// Utilities
import { createCanvas, exportCanvas } from '@workspace/image-editor/lib/fabric-canvas';
``` 