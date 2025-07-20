import React, { useState } from 'react';
import { cn } from '@workspace/ui/lib/utils';
import { Filter } from 'lucide-react';

interface FilterBottomProps {
  // Placeholder for filter-specific props
  onFilterChange?: (filterType: string, value: any) => void;
}

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

const Bottom: React.FC<FilterBottomProps> = ({ onFilterChange }) => {
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  return (
    <div className="bg-gray-900 text-white p-4">
      {/* Feature indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2 text-purple-400">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter Presets</span>
        </div>
      </div>

      {/* Filter intensity slider (placeholder) */}
      <div className="mb-4">
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-blue-600 h-2 rounded-full" style={{ width: '50%' }}></div>
        </div>
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Filter options */}
      <div className="grid grid-cols-4 gap-2">
        {filterOptions.map((filter) => (
          <button
            key={filter.key}
            onClick={() => {
              setSelectedFilter(filter.key);
              onFilterChange?.(filter.key, 50);
            }}
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