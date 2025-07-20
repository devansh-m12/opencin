import { useCallback } from 'react';
import { exportCanvas } from '../../lib/fabric-canvas';

export const useImageExport = (canvas: any) => {
  const save = useCallback((format: 'png' | 'jpeg' = 'png') => {
    if (!canvas) return null;
    
    try {
      return exportCanvas(canvas, format);
    } catch (error) {
      console.error('Failed to save canvas:', error);
      return null;
    }
  }, [canvas]);

  const downloadImage = useCallback((format: 'png' | 'jpeg' = 'png', filename?: string) => {
    const dataUrl = save(format);
    if (!dataUrl) return false;

    try {
      const link = document.createElement('a');
      link.download = filename || `edited-image.${format}`;
      link.href = dataUrl;
      link.click();
      return true;
    } catch (error) {
      console.error('Failed to download image:', error);
      return false;
    }
  }, [save]);

  const getImageData = useCallback(() => {
    if (!canvas) return null;
    
    try {
      return {
        png: exportCanvas(canvas, 'png'),
        jpeg: exportCanvas(canvas, 'jpeg'),
      };
    } catch (error) {
      console.error('Failed to get image data:', error);
      return null;
    }
  }, [canvas]);

  return {
    save,
    downloadImage,
    getImageData,
  };
}; 