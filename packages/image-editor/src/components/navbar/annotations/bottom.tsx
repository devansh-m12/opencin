import React, { useRef, useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Label } from '@workspace/ui/components/label';
import { Card, CardContent } from '@workspace/ui/components/card';
import { Plus, Type, Image, Upload, Edit3, Trash2 } from 'lucide-react';

interface AnnotationsBottomProps {
  hasImage?: boolean;
  onImageUpload?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAddText?: (text: string) => void;
  onAddShape?: (shape: 'rect' | 'circle' | 'triangle') => void;
  onClearImage?: () => void;
  fileInputRef?: React.RefObject<HTMLInputElement | null>;
}

const Bottom: React.FC<AnnotationsBottomProps> = ({
  hasImage = false,
  onImageUpload,
  onAddText,
  onAddShape,
  onClearImage,
  fileInputRef,
}) => {
  const [textInput, setTextInput] = useState('');

  const handleAddText = () => {
    if (textInput.trim() && onAddText) {
      onAddText(textInput);
      setTextInput('');
    }
  };

  if (!hasImage) {
    return (
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 text-green-400">
            <Edit3 className="h-4 w-4" />
            <span className="text-sm font-medium">Annotations</span>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm">
          Upload an image to start annotating
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4 space-y-4 max-h-96 overflow-y-auto">
      {/* Feature indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2 text-green-400">
          <Edit3 className="h-4 w-4" />
          <span className="text-sm font-medium">Annotations</span>
        </div>
      </div>

      {/* Image Upload Section */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-300">
              <Image className="h-4 w-4" />
              Image Upload
            </Label>
            <Button
              variant="outline"
              onClick={() => fileInputRef?.current?.click()}
              className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Upload className="h-4 w-4 mr-2" />
              Change Image
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
            />
          </div>
        </CardContent>
      </Card>

      {/* Text Tools */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-300">
              <Type className="h-4 w-4" />
              Add Text
            </Label>
            <div className="flex gap-2">
              <Input
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter text..."
                onKeyPress={(e) => e.key === 'Enter' && handleAddText()}
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400"
              />
              <Button
                size="sm"
                onClick={handleAddText}
                disabled={!textInput.trim()}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Shape Tools */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-300">
              <Edit3 className="h-4 w-4" />
              Add Shapes
            </Label>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape?.('rect')}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Rectangle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape?.('circle')}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Circle
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onAddShape?.('triangle')}
                className="bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
              >
                Triangle
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Image */}
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-4">
          <div className="space-y-2">
            <Label className="flex items-center gap-2 text-gray-300">
              <Trash2 className="h-4 w-4" />
              Clear Image
            </Label>
            <Button
              variant="outline"
              onClick={onClearImage}
              className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Canvas
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Bottom; 