import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { RotateCcw, RotateCw, Minus, Plus, Check, Edit3 } from 'lucide-react';

interface AnnotationsTopbarProps {
  onUndo?: () => void;
  onRedo?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onDone?: () => void;
  zoomLevel?: number;
  canUndo?: boolean;
  canRedo?: boolean;
}

const Topbar: React.FC<AnnotationsTopbarProps> = ({
  onUndo,
  onRedo,
  onZoomIn,
  onZoomOut,
  onDone,
  zoomLevel = 100,
  canUndo = false,
  canRedo = false,
}) => {
  return (
    <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white">
      {/* Left side - History controls */}
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Undo"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Redo"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Center - Feature indicator and Zoom controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-green-400">
          <Edit3 className="h-4 w-4" />
          <span className="text-sm font-medium">Annotations</span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onZoomOut}
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
            onClick={onZoomIn}
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
          onClick={onDone}
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