import React, { useRef, useState } from 'react';
import { useImageEditor, type FinetuneValues, useNavbar } from '../hooks';
import { ImageEditorProvider, useImageEditorContext } from '../contexts/image-editor-context';
import Navbar from './navbar';
import FinetuneTopbar from './navbar/finetune/topbar';
import FinetuneBottom from './navbar/finetune/bottom';
import FilterTopbar from './navbar/filter/topbar';
import FilterBottom from './navbar/filter/bottom';
import AnnotationsTopbar from './navbar/annotations/topbar';
import AnnotationsBottom from './navbar/annotations/bottom';
import { Button } from '@workspace/ui/components/button';
import { Upload, Image } from 'lucide-react';
import { Tool } from '../hooks';

interface ImageEditorWithNavbarProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onSave?: (dataUrl: string) => void;
}

const ImageEditorContent: React.FC<ImageEditorWithNavbarProps> = ({
  width = 800,
  height = 600,
  backgroundColor = '#ffffff',
  onSave,
}) => {
  const {
    canvas,
    canvasRef,
    currentTool,
    hasImage,
    finetuneValues,
    canvasDimensions,
    setTool,
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
    uploadImage,
  } = useImageEditorContext();

  const {
    activeFeature,
    setActiveFeature,
    isFeatureActive,
    showTopbar,
    showBottom,
  } = useNavbar({
    initialFeature: 'annotations',
    showTopbar: true,
    showBottom: true,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleToolChange = (tool: Tool) => {
    setTool(tool);
    
    // Handle special tool actions
    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        addText(text);
        setTool('select');
      }
    } else if (tool === 'rect' || tool === 'circle' || tool === 'triangle') {
      addShape(tool);
      setTool('select');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        await uploadImage(file);
        // Clear the file input so the same file can be selected again
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
    }
  };

  const handleSave = () => {
    const dataUrl = save();
    if (dataUrl && onSave) {
      onSave(dataUrl);
    } else if (dataUrl) {
      // Create download link
      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = dataUrl;
      link.click();
    }
  };

  const handleClearImage = () => {
    clear();
  };

  const handleReset = () => {
    if (activeFeature === 'finetune') {
      resetFinetune();
    }
    // Add other reset logic as needed
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 25));
  };

  // Calculate display size for the canvas container
  const getDisplaySize = () => {
    if (!hasImage) {
      return { width, height, scale: 1 };
    }

    const containerWidth = 800;
    const containerHeight = 600;
    
    const { width: canvasWidth, height: canvasHeight } = canvasDimensions;
    
    if (!canvasWidth || !canvasHeight || canvasWidth <= 0 || canvasHeight <= 0) {
      return { width: 400, height: 300, scale: 1 };
    }
    
    const scaleX = containerWidth / canvasWidth;
    const scaleY = containerHeight / canvasHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const displayWidth = Math.round(canvasWidth * scale);
    const displayHeight = Math.round(canvasHeight * scale);
    
    return {
      width: displayWidth,
      height: displayHeight,
      scale
    };
  };

  const displaySize = getDisplaySize();

  return (
    <div className="flex h-screen bg-background">
      {/* Left Sidebar - Main Navigation */}
      <Navbar 
        onReset={handleReset} 
        onSave={handleSave}
        activeFeature={activeFeature}
        setActiveFeature={setActiveFeature}
        isFeatureActive={isFeatureActive}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Top Toolbar - Conditional based on active feature */}
        {showTopbar && (
          <>
            {isFeatureActive('annotations') && <AnnotationsTopbar />}
            {isFeatureActive('finetune') && <FinetuneTopbar />}
            {isFeatureActive('filter') && <FilterTopbar />}
          </>
        )}

        {/* Canvas Area */}
        <div className="flex-1 p-4">
          <div className="h-full">
            {/* Canvas */}
            <div className="flex items-center justify-center bg-black rounded-lg overflow-hidden h-full">
              {!hasImage ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-border rounded shadow-sm"
                    style={{ 
                      width: `${width}px`, 
                      height: `${height}px`,
                      display: 'block'
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                    <div className="text-center p-8">
                      <div className="mb-4">
                        <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
                      <p className="text-muted-foreground mb-4">
                        Start by uploading an image to edit.
                      </p>
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="mx-auto"
                      >
                        <Image className="h-4 w-4 mr-2" />
                        Choose Image
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full flex items-center justify-center">
                  <canvas
                    ref={canvasRef}
                    className="border border-border rounded shadow-sm"
                    style={{ 
                      width: `${displaySize.width}px`, 
                      height: `${displaySize.height}px`,
                      display: 'block'
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                    {canvasDimensions.originalWidth} × {canvasDimensions.originalHeight}px
                    {canvasDimensions.scale < 1 && ` (${Math.round(canvasDimensions.scale * 100)}%)`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Toolbar - Conditional based on active feature */}
        {showBottom && (
          <>
            {isFeatureActive('annotations') && <AnnotationsBottom />}
            {isFeatureActive('finetune') && <FinetuneBottom />}
            {isFeatureActive('filter') && <FilterBottom />}
          </>
        )}
      </div>
    </div>
  );
};

export const ImageEditor: React.FC<ImageEditorWithNavbarProps> = (props) => {
  return (
    <ImageEditorProvider options={{ width: props.width || 800, height: props.height || 600, backgroundColor: props.backgroundColor }}>
      <ImageEditorContent {...props} />
    </ImageEditorProvider>
  );
}; 