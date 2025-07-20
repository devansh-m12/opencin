import { useState, useCallback, useRef, useEffect } from 'react';
import { createCanvas, resizeCanvas } from '../../lib/fabric-canvas';
import type { UseImageEditorOptions, CanvasDimensions } from './types';

export const useCanvas = (options: UseImageEditorOptions) => {
  const [canvas, setCanvas] = useState<any>(null);
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState<CanvasDimensions>({
    width: options.width,
    height: options.height,
    scale: 1,
    originalWidth: 0,
    originalHeight: 0
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load Fabric.js on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!window.fabric) {
        import('fabric').then((fabricModule) => {
          window.fabric = fabricModule.fabric;
          setIsFabricLoaded(true);
        }).catch((error) => {
          console.error('Failed to load Fabric.js:', error);
        });
      } else {
        setIsFabricLoaded(true);
      }
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
  }, [isFabricLoaded, canvas, options]);

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

  const resizeCanvasToSize = useCallback((newWidth: number, newHeight: number) => {
    if (!canvas) return;
    
    try {
      resizeCanvas(canvas, newWidth, newHeight);
      setCanvasDimensions(prev => ({
        ...prev,
        width: newWidth,
        height: newHeight
      }));
    } catch (error) {
      console.error('Failed to resize canvas:', error);
    }
  }, [canvas]);

  const updateCanvasDimensions = useCallback((dimensions: Partial<CanvasDimensions>) => {
    setCanvasDimensions(prev => ({
      ...prev,
      ...dimensions
    }));
  }, []);

  return {
    canvas,
    canvasRef,
    isFabricLoaded,
    canvasDimensions,
    initializeCanvas,
    resizeCanvasToSize,
    updateCanvasDimensions,
  };
}; 