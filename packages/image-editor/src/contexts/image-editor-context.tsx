import React, { createContext, useContext, ReactNode } from 'react';
import { useImageEditor, type UseImageEditorOptions, type Tool, type FinetuneValues } from '../hooks';

interface ImageEditorContextType {
  canvas: any;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  currentTool: Tool;
  hasImage: boolean;
  finetuneValues: FinetuneValues;
  canvasDimensions: {
    width: number;
    height: number;
    scale: number;
    originalWidth: number;
    originalHeight: number;
  };
  setTool: (tool: Tool) => void;
  addText: (text: string) => void;
  addShape: (shape: 'rect' | 'circle' | 'triangle') => void;
  clear: () => void;
  save: (format?: 'png' | 'jpeg') => string | null;
  undo: () => void;
  redo: () => void;
  updateFinetuneValue: (key: keyof FinetuneValues, value: number) => void;
  resetFinetune: () => void;
  loadImage: (imageUrl: string) => Promise<any>;
  uploadImage: (file: File) => Promise<void>;
  resizeCanvasToSize: (width: number, height: number) => void;
  getFilterStatus: () => any[];
  refreshFilters: () => void;
}

const ImageEditorContext = createContext<ImageEditorContextType | null>(null);

interface ImageEditorProviderProps {
  children: ReactNode;
  options: UseImageEditorOptions;
}

export const ImageEditorProvider: React.FC<ImageEditorProviderProps> = ({ 
  children, 
  options 
}) => {
  const imageEditorState = useImageEditor(options);

  // Add uploadImage method to handle file uploads with comprehensive error handling
  const uploadImage = async (file: File): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        reject(new Error('File must be an image'));
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        reject(new Error('File size must be less than 10MB'));
        return;
      }

      // Validate file size (min 1KB)
      const minSize = 1024; // 1KB
      if (file.size < minSize) {
        reject(new Error('File size must be at least 1KB'));
        return;
      }

      const reader = new FileReader();
      
      // Set timeout for file reading
      const timeoutId = setTimeout(() => {
        reader.abort();
        reject(new Error('File reading timeout'));
      }, 30000); // 30 second timeout

      reader.onload = async (e) => {
        clearTimeout(timeoutId);
        
        try {
          const imageUrl = e.target?.result as string;
          
          if (!imageUrl) {
            throw new Error('Failed to read file');
          }

          // Load the image into the editor
          const result = await imageEditorState.loadImage(imageUrl);
          
          if (!result) {
            throw new Error('Failed to load image into editor');
          }

          resolve();
        } catch (error) {
          console.error('Error uploading image:', error);
          reject(error);
        }
      };

      reader.onerror = () => {
        clearTimeout(timeoutId);
        reject(new Error('Failed to read file - file may be corrupted'));
      };

      reader.onabort = () => {
        reject(new Error('File reading was aborted'));
      };

      // Start reading the file
      reader.readAsDataURL(file);
    });
  };

  const contextValue = {
    ...imageEditorState,
    uploadImage,
  };

  return (
    <ImageEditorContext.Provider value={contextValue}>
      {children}
    </ImageEditorContext.Provider>
  );
};

export const useImageEditorContext = () => {
  const context = useContext(ImageEditorContext);
  if (!context) {
    throw new Error('useImageEditorContext must be used within an ImageEditorProvider');
  }
  return context;
}; 