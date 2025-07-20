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

## Components

- `ImageEditor` - Basic editor component
- `ImageEditorWithNavbar` - Advanced editor with navbar system
- `ClientImageEditor` - Client-side wrapper for basic editor
- `ClientImageEditorWithNavbar` - Client-side wrapper for navbar editor
- `Toolbar` - Editing tools toolbar
- `Navbar` - Main sidebar navigation

## Hooks

- `useImageEditor` - Custom hook for editor state management with finetune functionality
- `useNavbar` - Custom hook for navbar state management

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
import { useImageEditor, type FinetuneValues } from '@workspace/image-editor';

function MyCustomEditor() {
  const {
    canvas,
    hasImage,
    finetuneValues,
    updateFinetuneValue,
    resetFinetune,
    getFilterStatus, // New: Get current filter status
    refreshFilters,  // New: Manually refresh filters
  } = useImageEditor({
    width: 800,
    height: 600,
  });

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
- **Features**: Filter, Finetune
- **Controls**: Reset, Save
- **Navigation**: Switch between editing features

### 2. Top Toolbar (Optional)
- **Controls**: Undo, Redo, Zoom In/Out, Done
- **Context**: Changes based on active feature

### 3. Bottom Toolbar (Optional)
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

### Finetune Components
- `FinetuneTopbar` - Top toolbar for finetune mode
- `FinetuneBottom` - Bottom toolbar with adjustment sliders

### Filter Components
- `FilterTopbar` - Top toolbar for filter mode
- `FilterBottom` - Bottom toolbar with filter presets 