import React, { useRef, useState, useEffect } from 'react';
import { useImageEditor, type FinetuneValues } from '../hooks/use-image-editor';
import { useNavbar } from '../hooks/use-navbar';
import Navbar from './navbar';
import FinetuneTopbar from './navbar/finetune/topbar';
import FinetuneBottom from './navbar/finetune/bottom';
import FilterTopbar from './navbar/filter/topbar';
import FilterBottom from './navbar/filter/bottom';
import AnnotationsTopbar from './navbar/annotations/topbar';
import AnnotationsBottom from './navbar/annotations/bottom';
import { Button } from '@workspace/ui/components/button';
import { Upload, Image } from 'lucide-react';
import { Tool } from '../hooks/use-image-editor';

interface ImageEditorWithNavbarProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onSave?: (dataUrl: string) => void;
}

export const ImageEditor: React.FC<ImageEditorWithNavbarProps> = ({
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
  } = useImageEditor({
    width,
    height,
    backgroundColor,
  });

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
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });
  const [zoomLevel, setZoomLevel] = useState(100);

  // Auto-load image when canvas becomes available
  useEffect(() => {
    if (canvas && uploadedImage && !hasImage) {
      loadImage(uploadedImage).then((img) => {
        if (img) {
          // Update canvas size to match image
          const imgWidth = img.width || img.naturalWidth;
          const imgHeight = img.height || img.naturalHeight;
          setCanvasSize({ width: imgWidth, height: imgHeight });
          
          // Calculate scaled size and resize canvas
          const containerWidth = 800;
          const containerHeight = 600;
          const scaleX = containerWidth / imgWidth;
          const scaleY = containerHeight / imgHeight;
          const scale = Math.min(scaleX, scaleY, 1);
          const scaledWidth = Math.round(imgWidth * scale);
          const scaledHeight = Math.round(imgHeight * scale);
          
          // Resize canvas to match scaled display size
          resizeCanvasToSize(scaledWidth, scaledHeight);
          
          // Scale the background image to fit the new canvas size
          if (canvas.backgroundImage) {
            canvas.backgroundImage.scaleX = scale;
            canvas.backgroundImage.scaleY = scale;
            canvas.renderAll();
          }
        }
      });
    }
  }, [canvas, uploadedImage, hasImage, loadImage, resizeCanvasToSize]);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setUploadedImage(imageUrl);
        // The image will be auto-loaded when canvas becomes available
      };
      reader.readAsDataURL(file);
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
    setUploadedImage(null);
    setCanvasSize({ width, height });
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

  const handleFinetuneValueChange = (key: keyof FinetuneValues, value: number) => {
    console.log(`Finetune value change: ${key} = ${value}`);
    updateFinetuneValue(key, value);
  };

  const handleFilterChange = (filterType: string, value: any) => {
    // Placeholder for filter functionality
    console.log('Filter changed:', filterType, value);
  };

  // Calculate scaled canvas size to fit screen
  const getScaledCanvasSize = () => {
    const containerWidth = 800;
    const containerHeight = 600;
    
    const { width: imgWidth, height: imgHeight } = canvasSize;
    
    if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0) {
      return { width: 400, height: 300, scale: 1 };
    }
    
    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY, 1);
    
    const scaledWidth = Math.round(imgWidth * scale);
    const scaledHeight = Math.round(imgHeight * scale);
    
    return {
      width: scaledWidth,
      height: scaledHeight,
      scale
    };
  };

  const scaledSize = getScaledCanvasSize();

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
            {isFeatureActive('annotations') && (
              <AnnotationsTopbar
                onUndo={undo}
                onRedo={redo}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onDone={() => setActiveFeature('finetune')}
                zoomLevel={zoomLevel}
                canUndo={false} // TODO: Implement undo/redo state
                canRedo={false}
              />
            )}
            {isFeatureActive('finetune') && (
              <FinetuneTopbar
                onUndo={undo}
                onRedo={redo}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onDone={() => setActiveFeature('filter')}
                zoomLevel={zoomLevel}
                canUndo={false} // TODO: Implement undo/redo state
                canRedo={false}
              />
            )}
            {isFeatureActive('filter') && (
              <FilterTopbar
                onUndo={undo}
                onRedo={redo}
                onZoomIn={handleZoomIn}
                onZoomOut={handleZoomOut}
                onDone={() => setActiveFeature('annotations')}
                zoomLevel={zoomLevel}
                canUndo={false}
                canRedo={false}
              />
            )}
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
                      width: `${scaledSize.width}px`, 
                      height: `${scaledSize.height}px`,
                      display: 'block'
                    }}
                  />
                  <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                    {canvasSize.width} × {canvasSize.height}px
                    {scaledSize.scale < 1 && ` (${Math.round(scaledSize.scale * 100)}%)`}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Toolbar - Conditional based on active feature */}
        {showBottom && (
          <>
            {isFeatureActive('annotations') && (
              <AnnotationsBottom
                hasImage={hasImage}
                onImageUpload={handleImageUpload}
                onAddText={addText}
                onAddShape={addShape}
                onClearImage={handleClearImage}
                fileInputRef={fileInputRef}
              />
            )}
            {isFeatureActive('finetune') && (
              <FinetuneBottom
                values={finetuneValues}
                onValueChange={handleFinetuneValueChange}
                hasImage={hasImage}
              />
            )}
            {isFeatureActive('filter') && (
              <FilterBottom onFilterChange={handleFilterChange} />
            )}
          </>
        )}
      </div>
    </div>
  );
}; 