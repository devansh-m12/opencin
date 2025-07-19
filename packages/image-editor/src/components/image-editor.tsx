import React, { useRef, useState, useEffect } from 'react';
import { useImageEditor } from '../hooks/use-image-editor';
import { Toolbar } from './toolbar';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Plus, Type, Image, Upload, Edit3, Trash2 } from 'lucide-react';
import { Tool } from '../hooks/use-image-editor';

interface ImageEditorProps {
  width?: number;
  height?: number;
  backgroundColor?: string;
  onSave?: (dataUrl: string) => void;
}

export const ImageEditor: React.FC<ImageEditorProps> = ({
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
    setTool,
    loadImage,
    resizeCanvasToSize,
    addText,
    addShape,
    clear,
    save,
    undo,
    redo,
  } = useImageEditor({
    width,
    height,
    backgroundColor,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [textInput, setTextInput] = React.useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ width, height });

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

  const handleAddText = () => {
    if (textInput.trim()) {
      addText(textInput);
      setTextInput('');
    }
  };

  const handleClearImage = () => {
    clear();
    setUploadedImage(null);
    setCanvasSize({ width, height });
  };

  // Calculate scaled canvas size to fit screen
  const getScaledCanvasSize = () => {
    // Get container dimensions (approximate)
    const containerWidth = 800; // Max width for canvas area
    const containerHeight = 600; // Max height for canvas area
    
    const { width: imgWidth, height: imgHeight } = canvasSize;
    
    // Validate dimensions
    if (!imgWidth || !imgHeight || imgWidth <= 0 || imgHeight <= 0) {
      return { width: 400, height: 300, scale: 1 };
    }
    
    // Calculate scale to fit within container while preserving aspect ratio
    const scaleX = containerWidth / imgWidth;
    const scaleY = containerHeight / imgHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't scale up, only down
    
    // Calculate scaled dimensions - exact match to image size
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
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        currentTool={currentTool}
        onToolChange={handleToolChange}
        onUndo={undo}
        onRedo={redo}
        onClear={handleClearImage}
        onSave={handleSave}
        hasImage={hasImage}
      />
      
      <div className="flex-1 p-4">
        <div className="flex gap-4 h-full">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-black rounded-lg overflow-hidden">
            {!hasImage ? (
              <div className="relative w-full h-full flex items-center justify-center">
                {/* Always render canvas for initialization */}
                <canvas
                  ref={canvasRef}
                  className="border border-border rounded shadow-sm"
                  style={{ 
                    width: `${width}px`, 
                    height: `${height}px`,
                    display: 'block'
                  }}
                />
                {/* Upload overlay */}
                <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
                  <div className="text-center p-8">
                    <div className="mb-4">
                      <Upload className="h-16 w-16 text-muted-foreground mx-auto" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">Upload an Image</h3>
                    <p className="text-muted-foreground mb-4">
                      Start by uploading an image to edit. We'll maintain the original aspect ratio.
                    </p>
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="mx-auto"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </div>
                </div>
                {!canvas && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Initializing canvas...</p>
                    </div>
                  </div>
                )}
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
                {!canvas && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted/50">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                      <p className="text-muted-foreground">Initializing canvas...</p>
                    </div>
                  </div>
                )}
                {/* Image info overlay */}
                <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm px-2 py-1 rounded text-xs text-muted-foreground">
                  {canvasSize.width} × {canvasSize.height}px
                  {scaledSize.scale < 1 && ` (${Math.round(scaledSize.scale * 100)}%)`}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="w-64 space-y-4">
            {/* Image Upload Section */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Image className="h-4 w-4" />
                    Image Upload
                  </Label>
                  <Button
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {hasImage ? 'Change Image' : 'Upload Image'}
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  {uploadedImage && (
                    <div className="text-xs text-muted-foreground">
                      Image uploaded successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Text Tools */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Type className="h-4 w-4" />
                    Add Text
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="Enter text..."
                      onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                    />
                    <Button
                      size="sm"
                      onClick={handleAddText}
                      disabled={!textInput.trim() || !hasImage}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Shape Tools */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Edit3 className="h-4 w-4" />
                    Add Shapes
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShape('rect')}
                      disabled={!hasImage}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Rectangle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShape('circle')}
                      disabled={!hasImage}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Circle
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addShape('triangle')}
                      disabled={!hasImage}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Triangle
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clear Image */}
            {hasImage && (
              <Card>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4" />
                      Clear Image
                    </Label>
                    <Button
                      variant="outline"
                      onClick={handleClearImage}
                      className="w-full"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Canvas
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 