import { useState, useCallback, useRef, useEffect } from 'react';
import { createCanvas, addImageToCanvas, addTextToCanvas, addShapeToCanvas, clearCanvas, exportCanvas } from '../lib/fabric-canvas';

export type Tool = 'select' | 'draw' | 'text' | 'rect' | 'circle' | 'triangle' | 'image';

export interface UseImageEditorOptions {
  width: number;
  height: number;
  backgroundColor?: string;
}

export const useImageEditor = (options: UseImageEditorOptions) => {
  const [canvas, setCanvas] = useState<any>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load Fabric.js on client side
  useEffect(() => {
    if (typeof window !== 'undefined' && !window.fabric) {
      import('fabric').then((fabricModule) => {
        window.fabric = fabricModule.fabric;
        setIsFabricLoaded(true);
      });
    } else if (typeof window !== 'undefined' && window.fabric) {
      setIsFabricLoaded(true);
    }
  }, []);

  // Initialize canvas when fabric is loaded and canvas ref is available
  useEffect(() => {
    if (!canvasRef.current || !isFabricLoaded || canvas) return;

    try {
      const fabricCanvas = createCanvas(canvasRef.current, options);
      setCanvas(fabricCanvas);

      // Set up drawing mode
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.freeDrawingBrush.color = '#000000';
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }, [isFabricLoaded, canvas, options.width, options.height, options.backgroundColor]);

  const initializeCanvas = useCallback(() => {
    if (!canvasRef.current || !isFabricLoaded) return;

    try {
      const fabricCanvas = createCanvas(canvasRef.current, options);
      setCanvas(fabricCanvas);

      // Set up drawing mode
      fabricCanvas.isDrawingMode = false;
      fabricCanvas.freeDrawingBrush.width = 5;
      fabricCanvas.freeDrawingBrush.color = '#000000';

      return fabricCanvas;
    } catch (error) {
      console.error('Failed to initialize canvas:', error);
    }
  }, [options, isFabricLoaded]);

  const setTool = useCallback((tool: Tool) => {
    if (!canvas) return;

    setCurrentTool(tool);
    
    switch (tool) {
      case 'select':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case 'draw':
        canvas.isDrawingMode = true;
        canvas.selection = false;
        break;
      case 'text':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case 'rect':
      case 'circle':
      case 'triangle':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
      case 'image':
        canvas.isDrawingMode = false;
        canvas.selection = true;
        break;
    }
  }, [canvas]);

  const addImage = useCallback(async (imageUrl: string) => {
    if (!canvas) return;
    return await addImageToCanvas(canvas, imageUrl);
  }, [canvas]);

  const addText = useCallback((text: string) => {
    if (!canvas) return;
    return addTextToCanvas(canvas, text);
  }, [canvas]);

  const addShape = useCallback((shape: 'rect' | 'circle' | 'triangle') => {
    if (!canvas) return;
    return addShapeToCanvas(canvas, shape);
  }, [canvas]);

  const clear = useCallback(() => {
    if (!canvas) return;
    clearCanvas(canvas);
  }, [canvas]);

  const save = useCallback((format: 'png' | 'jpeg' = 'png') => {
    if (!canvas) return null;
    return exportCanvas(canvas, format);
  }, [canvas]);

  const undo = useCallback(() => {
    if (!canvas) return;
    // Note: Basic undo/redo would need to be implemented manually
    // For now, we'll just log that it's not implemented
    console.log('Undo not implemented yet');
  }, [canvas]);

  const redo = useCallback(() => {
    if (!canvas) return;
    // Note: Basic undo/redo would need to be implemented manually
    // For now, we'll just log that it's not implemented
    console.log('Redo not implemented yet');
  }, [canvas]);

  return {
    canvas,
    canvasRef,
    currentTool,
    isDrawing,
    initializeCanvas,
    setTool,
    addImage,
    addText,
    addShape,
    clear,
    save,
    undo,
    redo,
  };
}; 