import { useState, useCallback, useEffect } from 'react';
import { addTextToCanvas, addShapeToCanvas } from '../../lib/fabric-canvas';
import { useCanvas } from './use-canvas';
import { useFinetune } from './use-finetune';
import { useImageUpload } from './use-image-upload';
import { useImageExport } from './use-image-export';
import { useImageHistory } from './use-image-history';
import type { Tool, UseImageEditorOptions } from './types';

export const useImageEditor = (options: UseImageEditorOptions) => {
  const [currentTool, setCurrentTool] = useState<Tool>('select');

  // Initialize specialized hooks
  const canvasHook = useCanvas(options);
  const finetuneHook = useFinetune(canvasHook.canvas);
  const uploadHook = useImageUpload(canvasHook.canvas, canvasHook.updateCanvasDimensions);
  const exportHook = useImageExport(canvasHook.canvas);
  const historyHook = useImageHistory(canvasHook.canvas);

  // Tool management
  const setTool = useCallback((tool: Tool) => {
    if (!canvasHook.canvas) return;

    setCurrentTool(tool);
    
    switch (tool) {
      case 'select':
        canvasHook.canvas.isDrawingMode = false;
        canvasHook.canvas.selection = true;
        break;
      case 'draw':
        canvasHook.canvas.isDrawingMode = true;
        canvasHook.canvas.selection = false;
        break;
      case 'text':
        canvasHook.canvas.isDrawingMode = false;
        canvasHook.canvas.selection = true;
        break;
      case 'rect':
      case 'circle':
      case 'triangle':
        canvasHook.canvas.isDrawingMode = false;
        canvasHook.canvas.selection = true;
        break;
      case 'image':
        canvasHook.canvas.isDrawingMode = false;
        canvasHook.canvas.selection = true;
        break;
    }
  }, [canvasHook.canvas]);

  // Text and shape operations
  const addText = useCallback((text: string) => {
    if (!canvasHook.canvas) return;
    return addTextToCanvas(canvasHook.canvas, text);
  }, [canvasHook.canvas]);

  const addShape = useCallback((shape: 'rect' | 'circle' | 'triangle') => {
    if (!canvasHook.canvas) return;
    return addShapeToCanvas(canvasHook.canvas, shape);
  }, [canvasHook.canvas]);

  // Clear functionality
  const clear = useCallback(() => {
    if (!canvasHook.canvas) return;
    
    try {
      canvasHook.canvas.clear();
      canvasHook.canvas.backgroundColor = '#ffffff';
      canvasHook.canvas.renderAll();
      uploadHook.clearImage();
      canvasHook.updateCanvasDimensions({
        width: options.width,
        height: options.height,
        scale: 1,
        originalWidth: 0,
        originalHeight: 0
      });
    } catch (error) {
      console.error('Failed to clear canvas:', error);
    }
  }, [canvasHook.canvas, canvasHook.updateCanvasDimensions, options.width, options.height, uploadHook]);

  // Save history when canvas changes
  useEffect(() => {
    if (canvasHook.canvas && uploadHook.hasImage) {
      // Save state after a delay to avoid too frequent saves
      const timeoutId = setTimeout(() => {
        historyHook.saveState();
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [canvasHook.canvas, uploadHook.hasImage, historyHook]);

  return {
    // Canvas state
    canvas: canvasHook.canvas,
    canvasRef: canvasHook.canvasRef,
    isFabricLoaded: canvasHook.isFabricLoaded,
    canvasDimensions: canvasHook.canvasDimensions,
    
    // Tool state
    currentTool,
    
    // Image state
    hasImage: uploadHook.hasImage,
    
    // Finetune state
    finetuneValues: finetuneHook.finetuneValues,
    
    // Canvas operations
    initializeCanvas: canvasHook.initializeCanvas,
    resizeCanvasToSize: canvasHook.resizeCanvasToSize,
    
    // Tool operations
    setTool,
    
    // Image operations
    addImage: uploadHook.addImage,
    loadImage: uploadHook.loadImage,
    uploadImage: uploadHook.uploadImage,
    
    // Content operations
    addText,
    addShape,
    clear,
    
    // Export operations
    save: exportHook.save,
    downloadImage: exportHook.downloadImage,
    getImageData: exportHook.getImageData,
    
    // History operations
    undo: historyHook.undo,
    redo: historyHook.redo,
    canUndo: historyHook.canUndo,
    canRedo: historyHook.canRedo,
    
    // Finetune operations
    updateFinetuneValue: finetuneHook.updateFinetuneValue,
    resetFinetune: finetuneHook.resetFinetune,
    getFilterStatus: finetuneHook.getFilterStatus,
    refreshFilters: finetuneHook.refreshFilters,
  };
}; 