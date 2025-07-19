import * as React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { 
  MousePointer, 
  Pen, 
  Type, 
  Square, 
  Circle, 
  Triangle, 
  RotateCcw, 
  RotateCw, 
  Trash2,
  Download
} from 'lucide-react';
import { Tool } from '../hooks/use-image-editor';

interface ToolbarProps {
  currentTool: Tool;
  onToolChange: (tool: Tool) => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  onSave: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
  hasImage?: boolean;
}

const tools = [
  { id: 'select' as Tool, icon: MousePointer, label: 'Select' },
  { id: 'draw' as Tool, icon: Pen, label: 'Draw' },
  { id: 'text' as Tool, icon: Type, label: 'Text' },
  { id: 'rect' as Tool, icon: Square, label: 'Rectangle' },
  { id: 'circle' as Tool, icon: Circle, label: 'Circle' },
  { id: 'triangle' as Tool, icon: Triangle, label: 'Triangle' },
];

export const Toolbar: React.FC<ToolbarProps> = ({
  currentTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  onSave,
  canUndo = false,
  canRedo = false,
  hasImage = false,
}) => {
  return (
    <div className="flex items-center gap-2 p-4 bg-background border-b">
      {/* Drawing Tools */}
      <div className="flex items-center gap-1">
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Button
              key={tool.id}
              variant={currentTool === tool.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => onToolChange(tool.id)}
              title={tool.label}
              className="h-8 w-8 p-0"
              disabled={!hasImage && tool.id !== 'select'}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* History Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo || !hasImage}
          title="Undo"
          className="h-8 w-8 p-0"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo || !hasImage}
          title="Redo"
          className="h-8 w-8 p-0"
        >
          <RotateCw className="h-4 w-4" />
        </Button>
      </div>

      <Separator orientation="vertical" className="h-6" />

      {/* Action Controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={onClear}
          disabled={!hasImage}
          title="Clear Canvas"
          className="h-8 w-8 p-0"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
        <Button
          variant="default"
          size="sm"
          onClick={onSave}
          disabled={!hasImage}
          title="Save Image"
          className="h-8 px-3"
        >
          <Download className="h-4 w-4 mr-1" />
          Save
        </Button>
      </div>
    </div>
  );
}; 