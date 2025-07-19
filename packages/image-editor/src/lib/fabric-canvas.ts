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
  
  return new window.fabric.Canvas(element, {
    width: options.width,
    height: options.height,
    backgroundColor: options.backgroundColor || '#ffffff',
    selection: true,
    preserveObjectStacking: true,
  });
};

export const addImageToCanvas = async (
  canvas: any,
  imageUrl: string,
  options?: {
    left?: number;
    top?: number;
    scaleX?: number;
    scaleY?: number;
  }
) => {
  if (typeof window === 'undefined') {
    throw new Error('Fabric.js can only be used on the client side');
  }
  
  return new Promise<any>((resolve, reject) => {
    window.fabric.Image.fromURL(
      imageUrl,
      (img: any) => {
        if (options) {
          img.set(options);
        }
        
        // Center the image if no position specified
        if (!options?.left && !options?.top) {
          img.center();
        }
        
        canvas.add(img);
        canvas.renderAll();
        resolve(img);
      },
      { crossOrigin: 'anonymous' }
    );
  });
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