import React, { useEffect, useRef } from 'react';
import { useImageEditor } from '../hooks/use-image-editor';
import { Toolbar } from './toolbar';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@workspace/ui/components/dialog';
import { Plus, Type, Image } from 'lucide-react';

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
    setTool,
    addImage,
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

  // Canvas initialization is now handled automatically in the hook

  const handleToolChange = (tool: any) => {
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
    } else if (tool === 'image') {
      fileInputRef.current?.click();
      setTool('select');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        addImage(imageUrl);
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

  return (
    <div className="flex flex-col h-full bg-background">
      <Toolbar
        currentTool={currentTool}
        onToolChange={handleToolChange}
        onUndo={undo}
        onRedo={redo}
        onClear={clear}
        onSave={handleSave}
      />
      
      <div className="flex-1 p-4">
        <div className="flex gap-4 h-full">
          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center bg-muted rounded-lg">
            <canvas
              ref={canvasRef}
              className="border border-border rounded shadow-sm"
            />
          </div>

          {/* Sidebar */}
          <div className="w-64 space-y-4">
            {/* Text Input */}
            <div className="space-y-2">
              <Label htmlFor="text-input">Add Text</Label>
              <div className="flex gap-2">
                <Input
                  id="text-input"
                  value={textInput}
                  onChange={(e) => setTextInput(e.target.value)}
                  placeholder="Enter text..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                />
                <Button
                  size="sm"
                  onClick={handleAddText}
                  disabled={!textInput.trim()}
                >
                  <Type className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Quick Shapes */}
            <div className="space-y-2">
              <Label>Quick Shapes</Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape('rect')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Rectangle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape('circle')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Circle
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addShape('triangle')}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Triangle
                </Button>
              </div>
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Upload Image</Label>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="w-full"
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
      </div>
    </div>
  );
}; 