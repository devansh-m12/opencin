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

export interface CanvasDimensions {
  width: number;
  height: number;
  scale: number;
  originalWidth: number;
  originalHeight: number;
}

export interface ImageEditorState {
  canvas: any;
  currentTool: Tool;
  isFabricLoaded: boolean;
  hasImage: boolean;
  canvasDimensions: CanvasDimensions;
  finetuneValues: FinetuneValues;
}

export interface ImageUploadResult {
  image: any;
  originalWidth: number;
  originalHeight: number;
  canvasWidth: number;
  canvasHeight: number;
  scale: number;
}

export interface FilterStatus {
  index: number;
  type: string;
  adjustmentType: string;
  properties: string[];
} 