import React, { useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Filter } from 'lucide-react';
import { useImageEditorContext } from '../../../contexts/image-editor-context';

const filterOptions = [
  { key: 'vintage', label: 'Vintage' },
  { key: 'blackwhite', label: 'B&W' },
  { key: 'sepia', label: 'Sepia' },
  { key: 'warm', label: 'Warm' },
  { key: 'cool', label: 'Cool' },
  { key: 'dramatic', label: 'Dramatic' },
  { key: 'soft', label: 'Soft' },
  { key: 'sharp', label: 'Sharp' },
] as const;

const Bottom: React.FC = () => {
  const { hasImage } = useImageEditorContext();
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);
  const [filterIntensity, setFilterIntensity] = useState(50);

  const handleFilterChange = (filterType: string, value: any) => {
    setSelectedFilter(filterType);
    setFilterIntensity(value);
    // Note: Filter application would need to be implemented
    console.log('Filter applied:', filterType, value);
  };

  if (!hasImage) {
    return (
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 text-purple-400">
            <Filter className="h-4 w-4" />
            <span className="text-sm font-medium">Filter Presets</span>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm">
          Upload an image to apply filters
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4">
      {/* Feature indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2 text-purple-400">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter Presets</span>
        </div>
      </div>

      {/* Filter intensity slider */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full" 
            style={{ width: `${filterIntensity}%` }}
          ></div>
        </div>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>0%</span>
          <span>{filterIntensity}%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Filter options */}
      <div className="grid grid-cols-4 gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => handleFilterChange(filter.key, filterIntensity)}
            className={cn(
              "px-3 py-2 rounded text-xs transition-colors",
              selectedFilter === filter.key
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Bottom;