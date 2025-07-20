// Client-side only fabric utilities
export interface CanvasOptions {
  width: number;
  height: number;
  backgroundColor?: string;
}

// Type definitions for fabric
declare global {
  interface Window {
    fabric: any;
  }
}

export const createCanvas = (element: HTMLCanvasElement, options: CanvasOptions) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  if (!window.fabric) {
    throw new Error('Fabric.js not loaded. Please ensure it is imported on the client side.');
  }
  
  const fabricCanvas = new window.fabric.Canvas(element, {
    width: options.width,
    height: options.height,
    backgroundColor: options.backgroundColor || '#ffffff',
    selection: true,
    preserveObjectStacking: true,
  });
  
  return fabricCanvas;
};

export const addImageToCanvas = async (
  canvas: any,
  imageUrl: string,
  options?: {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
    maintainAspectRatio?: boolean;
  }
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  return new Promise<any>((resolve, _reject) => {
    window.fabric.Image.fromURL(
      imageUrl,
      (img: any) => {
        if (options) {
          img.set(options);
        }
        
        // Calculate aspect ratio and fit image to canvas
        const canvasWidth = canvas.getWidth();
        const canvasHeight = canvas.getHeight();
        const imgWidth = img.width || img.naturalWidth;
        const imgHeight = img.height || img.naturalHeight;
        
        // Calculate scale to fit image within canvas while maintaining aspect ratio
        const scaleX = canvasWidth / imgWidth;
        const scaleY = canvasHeight / imgHeight;
        const scale = Math.min(scaleX, scaleY) * 0.9; // 90% of max size to leave some margin
        
        img.scale(scale);
        
        // Center the image
        img.center();
        
        canvas.add(img);
        canvas.renderAll();
        resolve(img);
      },
      { crossOrigin: 'anonymous' }
    );
  });
};

export const loadImageAsBackground = async (
  canvas: any,
  imageUrl: string
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  return new Promise<any>((resolve, reject) => {
    // Create a temporary image to get dimensions first
    const tempImg = new Image();
    tempImg.crossOrigin = 'anonymous';
    
    // Set a timeout for image loading
    const timeoutId = setTimeout(() => {
      reject(new Error('Image loading timeout'));
    }, 30000); // 30 second timeout
    
    tempImg.onload = () => {
      clearTimeout(timeoutId);
      
      try {
        // Get original image dimensions
        const imgWidth = tempImg.naturalWidth || tempImg.width;
        const imgHeight = tempImg.naturalHeight || tempImg.height;
        
        // Validate dimensions
        if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0) {
          console.error('Invalid image dimensions:', { imgWidth, imgHeight });
          reject(new Error('Invalid image dimensions'));
          return;
        }
        
        // Check for minimum image size
        const minDimension = 10;
        if (imgWidth < minDimension || imgHeight < minDimension) {
          console.error('Image too small:', { imgWidth, imgHeight });
          reject(new Error('Image too small'));
          return;
        }
        
        // Check for reasonable image size (prevent extremely large images)
        const maxDimension = 4096;
        if (imgWidth > maxDimension || imgHeight > maxDimension) {
          console.warn('Image is very large, consider resizing:', { imgWidth, imgHeight });
        }
        
        // Now load with Fabric.js
        window.fabric.Image.fromURL(
          imageUrl,
          (img: any) => {
            try {
              // Validate the fabric image
              if (!img || !img.width || !img.height) {
                throw new Error('Failed to create fabric image');
              }
              
              // Clear existing objects and background
              canvas.clear();
              canvas.setBackgroundImage(null, () => {
                // Set the new background image
                canvas.setBackgroundImage(img, () => {
                  // Calculate optimal canvas size based on image and container
                  const containerWidth = 800; // Default container width
                  const containerHeight = 600; // Default container height
                  
                  // Calculate scale to fit image within container while maintaining aspect ratio
                  const scaleX = containerWidth / imgWidth;
                  const scaleY = containerHeight / imgHeight;
                  const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
                  
                  // Ensure minimum scale for very small images
                  const minScale = 0.1;
                  const finalScale = Math.max(scale, minScale);
                  
                  // Calculate new canvas dimensions
                  const newCanvasWidth = Math.round(imgWidth * finalScale);
                  const newCanvasHeight = Math.round(imgHeight * finalScale);
                  
                  // Ensure minimum canvas size
                  const minCanvasSize = 100;
                  const finalCanvasWidth = Math.max(newCanvasWidth, minCanvasSize);
                  const finalCanvasHeight = Math.max(newCanvasHeight, minCanvasSize);
                  
                  // Resize canvas to match the scaled image size
                  canvas.setWidth(finalCanvasWidth);
                  canvas.setHeight(finalCanvasHeight);
                  
                  // Scale the background image to fit the new canvas size
                  img.scaleX = finalScale;
                  img.scaleY = finalScale;
                  img.left = 0;
                  img.top = 0;
                  
                  // Center the image if it's smaller than the canvas
                  if (finalScale < 1) {
                    const offsetX = (finalCanvasWidth - (imgWidth * finalScale)) / 2;
                    const offsetY = (finalCanvasHeight - (imgHeight * finalScale)) / 2;
                    img.left = Math.max(0, offsetX);
                    img.top = Math.max(0, offsetY);
                  }
                  
                  // Apply the background image again with new settings
                  canvas.setBackgroundImage(img, () => {
                    canvas.renderAll();
                    resolve({
                      image: img,
                      originalWidth: imgWidth,
                      originalHeight: imgHeight,
                      canvasWidth: finalCanvasWidth,
                      canvasHeight: finalCanvasHeight,
                      scale: finalScale
                    });
                  });
                });
              });
            } catch (error) {
              console.error('Error setting background image:', error);
              reject(error);
            }
          },
          { crossOrigin: 'anonymous' }
        );
      } catch (error) {
        clearTimeout(timeoutId);
        console.error('Error processing image:', error);
        reject(error);
      }
    };
    
    tempImg.onerror = () => {
      clearTimeout(timeoutId);
      console.error('Failed to load image:', imageUrl);
      reject(new Error('Failed to load image - check if the image format is supported'));
    };
    
    tempImg.src = imageUrl;
  });
};

export const resizeCanvas = (
  canvas: any,
  newWidth: number,
  newHeight: number
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  // Store current zoom and pan
  const currentZoom = canvas.getZoom();
  const currentViewportTransform = canvas.viewportTransform;
  
  // Resize canvas
  canvas.setWidth(newWidth);
  canvas.setHeight(newHeight);
  
  // Maintain zoom and pan
  canvas.setZoom(currentZoom);
  canvas.setViewportTransform(currentViewportTransform);
  
  canvas.renderAll();
};

export const addTextToCanvas = (
  canvas: any,
  text: string,
  options?: {
    left?: number;
    top?: number;
    fontSize?: number;
    fontFamily?: string;
    fill?: string;
  }
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  const textbox = new window.fabric.Textbox(text, {
    left: options?.left || 50,
    top: options?.top || 50,
    fontSize: options?.fontSize || 20,
    fontFamily: options?.fontFamily || 'Arial',
    fill: options?.fill || '#000000',
    editable: true,
  });
  
  canvas.add(textbox);
  canvas.renderAll();
  return textbox;
};

export const addShapeToCanvas = (
  canvas: any,
  shape: 'rect' | 'circle' | 'triangle',
  options?: {
    left?: number;
    top?: number;
    width?: number;
    height?: number;
    fill?: string;
    stroke?: string;
    strokeWidth?: number;
  }
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  let fabricObject: any;
  
  switch (shape) {
    case 'rect':
      fabricObject = new window.fabric.Rect({
        left: options?.left || 50,
        top: options?.top || 50,
        width: options?.width || 100,
        height: options?.height || 100,
        fill: options?.fill || '#ff0000',
        stroke: options?.stroke || '#000000',
        strokeWidth: options?.strokeWidth || 1,
      });
      break;
    case 'circle':
      fabricObject = new window.fabric.Circle({
        left: options?.left || 50,
        top: options?.top || 50,
        radius: (options?.width || 50) / 2,
        fill: options?.fill || '#00ff00',
        stroke: options?.stroke || '#000000',
        strokeWidth: options?.strokeWidth || 1,
      });
      break;
    case 'triangle':
      fabricObject = new window.fabric.Triangle({
        left: options?.left || 50,
        top: options?.top || 50,
        width: options?.width || 100,
        height: options?.height || 100,
        fill: options?.fill || '#0000ff',
        stroke: options?.stroke || '#000000',
        strokeWidth: options?.strokeWidth || 1,
      });
      break;
  }
  
  canvas.add(fabricObject);
  canvas.renderAll();
  return fabricObject;
};

export const clearCanvas = (canvas: any) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  canvas.clear();
  canvas.backgroundColor = '#ffffff';
  canvas.renderAll();
};

export const exportCanvas = (canvas: any, format: 'png' | 'jpeg' = 'png') => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  return canvas.toDataURL({
    format,
    quality: 1,
  });
}; 