import React, { useState } from 'react';
import { Button } from '@workspace/ui/components/button';
import { RotateCcw, RotateCw, Minus, Plus, Check, Sliders } from 'lucide-react';
import { useImageEditorContext } from '../../../contexts/image-editor-context';

const Topbar: React.FC = () => {
  const { undo, redo, hasImage } = useImageEditorContext();
  const [zoomLevel, setZoomLevel] = useState(100);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 200));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 25));
  };

  const handleDone = () => {
    // This could be handled by a context or parent component
    console.log('Finetune done');
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
      {/* Left side - History controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={undo}
          disabled={!hasImage}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={redo}
          disabled={!hasImage}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Redo"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Feature indicator and Zoom controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-blue-400">
          <Sliders className="h-4 w-4" />
          <span className="text-sm font-medium">Finetune</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomOut}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
            title="Zoom Out"
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="text-sm font-medium min-w-[3rem] text-center">
            {zoomLevel}%
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleZoomIn}
            className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
            title="Zoom In"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Right side - Done button */}
      <div>
        <Button
          variant="default"
          size="sm"
          onClick={handleDone}
          className="bg-yellow-600 hover:bg-yellow-700 text-white px-4"
        >
          <Check className="h-4 w-4 mr-1" />
          Done
        </Button>
      </div>
    </div>
  );
};

export default Topbar;