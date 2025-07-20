import { useState, useCallback, useRef, useEffect } from 'react';
import { createCanvas, addImageToCanvas, addTextToCanvas, addShapeToCanvas, clearCanvas, exportCanvas, loadImageAsBackground, resizeCanvas } from '../lib/fabric-canvas';

export type Tool = 'select' | 'draw' | 'text' | 'rect' | 'circle' | 'triangle' | 'image';

export interface UseImageEditorOptions {
  width: number;
  height: number;
  backgroundColor?: string;
}

export interface FinetuneValues {
  brightness: number;
  contrast: number;
  saturation: number;
  exposure: number;
  temperature: number;
  gamma: number;
  clarity: number;
  vignette: number;
}

export const useImageEditor = (options: UseImageEditorOptions) => {
  const [canvas, setCanvas] = useState<any>(null);
  const [currentTool, setCurrentTool] = useState<Tool>('select');
  const [isFabricLoaded, setIsFabricLoaded] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [canvasDimensions, setCanvasDimensions] = useState({
    width: options.width,
    height: options.height,
    scale: 1,
    originalWidth: 0,
    originalHeight: 0
  });
  const [finetuneValues, setFinetuneValues] = useState<FinetuneValues>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    temperature: 0,
    gamma: 0,
    clarity: 0,
    vignette: 0,
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
        setCanvasDimensions({
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
  }, [canvas]);

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
    
    try {
      clearCanvas(canvas);
      setHasImage(false);
      setCanvasDimensions({
        width: options.width,
        height: options.height,
        scale: 1,
        originalWidth: 0,
        originalHeight: 0
      });
    } catch (error) {
      console.error('Failed to clear canvas:', error);
    }
  }, [canvas, options.width, options.height]);

  const save = useCallback((format: 'png' | 'jpeg' = 'png') => {
    if (!canvas) return null;
    
    try {
      return exportCanvas(canvas, format);
    } catch (error) {
      console.error('Failed to save canvas:', error);
      return null;
    }
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

  // Finetune functionality
  const applyFinetuneEffect = useCallback((key: keyof FinetuneValues, value: number) => {
    if (!canvas || typeof window === 'undefined') return;

    try {
      // Get the background image
      const backgroundImage = canvas.backgroundImage;
      if (!backgroundImage) return;



      // Initialize filters array if it doesn't exist
      if (!backgroundImage.filters) {
        backgroundImage.filters = [];
      }

      // Helper function to remove existing filter for a specific adjustment type
      const removeExistingFilter = (adjustmentType: string) => {
        const filterIndex = backgroundImage.filters.findIndex((filter: any) => 
          filter._adjustmentType === adjustmentType
        );
        
        if (filterIndex !== -1) {
          backgroundImage.filters.splice(filterIndex, 1);
          return true;
        }
        return false;
      };

      // Remove existing filter for this adjustment if it exists
      removeExistingFilter(key);

      // Only apply filter if value is not 0 (neutral)
      let shouldApplyFilter = false;
      let filterToApply: any = null;

      // Apply different effects based on the key
      switch (key) {
        case 'brightness':
          if (value !== 0) {
            // Use a more responsive brightness range (-0.4 to 0.4)
            const brightnessValue = Math.max(-0.4, Math.min(0.4, value / 250));
            filterToApply = new window.fabric.Image.filters.Brightness({
              brightness: brightnessValue
            });
            filterToApply._adjustmentType = 'brightness';
            shouldApplyFilter = true;
          }
          break;

        case 'contrast':
          if (value !== 0) {
            // Use a more responsive contrast range (-0.4 to 0.4)
            const contrastValue = Math.max(-0.4, Math.min(0.4, value / 250));
            filterToApply = new window.fabric.Image.filters.Contrast({
              contrast: contrastValue
            });
            filterToApply._adjustmentType = 'contrast';
            shouldApplyFilter = true;
          }
          break;

        case 'saturation':
          if (value !== 0) {
            // Use a more responsive saturation range (-0.5 to 0.5)
            const saturationValue = Math.max(-0.5, Math.min(0.5, value / 200));
            filterToApply = new window.fabric.Image.filters.Saturation({
              saturation: saturationValue
            });
            filterToApply._adjustmentType = 'saturation';
            shouldApplyFilter = true;
          }
          break;

        case 'exposure':
          if (value !== 0) {
            // Use a more responsive exposure range (-0.3 to 0.3)
            const exposureValue = Math.max(-0.3, Math.min(0.3, value / 333));
            filterToApply = new window.fabric.Image.filters.Brightness({
              brightness: exposureValue
            });
            filterToApply._adjustmentType = 'exposure';
            shouldApplyFilter = true;
          }
          break;

        case 'temperature':
          if (value > 0) {
            // Warm (more red/yellow) - use more responsive alpha values
            const alphaValue = Math.min(0.3, value / 333);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#ff8c00',
              mode: 'tint',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'temperature';
            shouldApplyFilter = true;
          } else if (value < 0) {
            // Cool (more blue) - use more responsive alpha values
            const alphaValue = Math.min(0.3, Math.abs(value) / 333);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#0066cc',
              mode: 'tint',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'temperature';
            shouldApplyFilter = true;
          }
          break;

        case 'gamma':
          if (value !== 0) {
            // Use a more responsive gamma range (0.6 to 1.4)
            const gammaValue = Math.max(0.6, Math.min(1.4, 1 + (value / 250)));
            filterToApply = new window.fabric.Image.filters.Gamma({
              gamma: [gammaValue, gammaValue, gammaValue]
            });
            filterToApply._adjustmentType = 'gamma';
            shouldApplyFilter = true;
          }
          break;

        case 'clarity':
          if (value > 0) {
            // Use more responsive opacity for clarity
            const opacityValue = Math.min(0.4, value / 250);
            filterToApply = new window.fabric.Image.filters.Convolute({
              matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
              opacity: opacityValue
            });
            filterToApply._adjustmentType = 'clarity';
            shouldApplyFilter = true;
          }
          break;

        case 'vignette':
          if (value > 0) {
            // Use more responsive alpha for vignette
            const alphaValue = Math.min(0.4, value / 250);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#000000',
              mode: 'multiply',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'vignette';
            shouldApplyFilter = true;
          }
          break;
      }

      // Apply the filter if we have one
      if (shouldApplyFilter && filterToApply) {
        backgroundImage.filters.push(filterToApply);
      }

      // Apply filters and render
      backgroundImage.applyFilters();
      canvas.renderAll();

    } catch (error) {
      console.error('Error applying finetune effect:', error);
    }
  }, [canvas]);

  const updateFinetuneValue = useCallback((key: keyof FinetuneValues, value: number) => {
    if (!canvas) return;



    // Update the state immediately for UI responsiveness
    setFinetuneValues(prev => ({
      ...prev,
      [key]: value,
    }));

    // Apply the finetune effect immediately for better responsiveness
    // Remove the setTimeout delay as it can cause issues with filter removal
    applyFinetuneEffect(key, value);
  }, [canvas, applyFinetuneEffect]);

  const resetFinetune = useCallback(() => {
    if (!canvas) return;



    const resetValues: FinetuneValues = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      gamma: 0,
      clarity: 0,
      vignette: 0,
    };

    setFinetuneValues(resetValues);

    // Clear all filters from the background image
    if (canvas.backgroundImage) {

      
      // Clear the filters array completely
      canvas.backgroundImage.filters = [];
      
      // Apply the cleared filters to update the image
      canvas.backgroundImage.applyFilters();
      
      // Re-render the canvas
      canvas.renderAll();
      
    }
  }, [canvas]);

  // Helper function to get current filter status for debugging
  const getFilterStatus = useCallback(() => {
    if (!canvas?.backgroundImage?.filters) return [];
    
    return canvas.backgroundImage.filters.map((filter: any, index: number) => ({
      index,
      type: filter.constructor.name,
      adjustmentType: filter._adjustmentType,
      properties: Object.keys(filter).filter(key => !key.startsWith('_'))
    }));
  }, [canvas]);

        // Helper function to manually refresh filters (useful for debugging)
      const refreshFilters = useCallback(() => {
        if (!canvas?.backgroundImage) return;
        
        canvas.backgroundImage.applyFilters();
        canvas.renderAll();
      }, [canvas]);

  return {
    canvas,
    canvasRef,
    currentTool,
    hasImage,
    finetuneValues,
    canvasDimensions,
    initializeCanvas,
    setTool,
    addImage,
    loadImage,
    resizeCanvasToSize,
    addText,
    addShape,
    clear,
    save,
    undo,
    redo,
    updateFinetuneValue,
    resetFinetune,
    getFilterStatus,
    refreshFilters,
  };
}; 