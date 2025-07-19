# Image Editor Package

A React-based image editor built with Fabric.js for the OpenDov workspace.

## Features

- Canvas-based image editing
- Drawing tools (brush, pen, shapes)
- Text overlay support
- Image filters and effects
- Undo/redo functionality
- Export capabilities

## Usage

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

## Components

- `ImageEditor` - Main editor component
- `Toolbar` - Editing tools toolbar
- `Canvas` - Fabric.js canvas wrapper

## Hooks

- `useImageEditor` - Custom hook for editor state management
- `useCanvas` - Hook for canvas operations 