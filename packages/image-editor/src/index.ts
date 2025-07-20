export { ImageEditor } from './components/image-editor';
export { ClientImageEditor } from './components/client-image-editor';
export { Toolbar } from './components/toolbar';

// Export all hooks from the new modular structure
export * from './hooks';

export * from './lib/fabric-canvas';

// Context
export { ImageEditorProvider, useImageEditorContext } from './contexts/image-editor-context';

// Navbar components
export { default as Navbar } from './components/navbar';
export * from './components/navbar/annotations';
export * from './components/navbar/finetune';
export * from './components/navbar/filter'; 