import { useState, useCallback } from 'react';
import { addImageToCanvas, loadImageAsBackground } from '../../lib/fabric-canvas';
import type { ImageUploadResult } from './types';

export const useImageUpload = (canvas: any, updateCanvasDimensions: (dimensions: any) => void) => {
  const [hasImage, setHasImage] = useState(false);

  const addImage = useCallback(async (imageUrl: string) => {
    if (!canvas) return;
    const result = await addImageToCanvas(canvas, imageUrl);
    setHasImage(true);
    return result;
  }, [canvas]);

  const loadImage = useCallback(async (imageUrl: string) => {
    if (!canvas) {
      console.error('Canvas not initialized');
      return null;
    }
    
    try {
      const result = await loadImageAsBackground(canvas, imageUrl);
      
      if (result) {
        setHasImage(true);
        updateCanvasDimensions({
          width: result.canvasWidth,
          height: result.canvasHeight,
          scale: result.scale,
          originalWidth: result.originalWidth,
          originalHeight: result.originalHeight
        });
      }
      
      return result;
    } catch (error) {
      console.error('Failed to load image:', error);
      setHasImage(false);
      return null;
    }
  }, [canvas, updateCanvasDimensions]);

  const uploadImage = useCallback(async (file: File): Promise<void> => {
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
          const result = await loadImage(imageUrl);
          
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
  }, [loadImage]);

  const clearImage = useCallback(() => {
    if (!canvas) return;
    
    try {
      canvas.clear();
      canvas.backgroundColor = '#ffffff';
      canvas.renderAll();
      setHasImage(false);
    } catch (error) {
      console.error('Failed to clear canvas:', error);
    }
  }, [canvas]);

  return {
    hasImage,
    addImage,
    loadImage,
    uploadImage,
    clearImage,
  };
}; 