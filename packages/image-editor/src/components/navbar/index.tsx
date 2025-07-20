import React from 'react';
import { Button } from '@workspace/ui/components/button';
import { Filter, Sliders, RotateCcw, Save } from 'lucide-react';
import { cn } from '@workspace/ui/lib/utils';
import { NavbarFeature } from '../../hooks/use-navbar';

interface NavbarProps {
  onReset?: () => void;
  onSave?: () => void;
  activeFeature: NavbarFeature;
  setActiveFeature: (feature: NavbarFeature) => void;
  isFeatureActive: (feature: NavbarFeature) => boolean;
}

const Navbar: React.FC<NavbarProps> = ({ 
  onReset, 
  onSave, 
  activeFeature, 
  setActiveFeature, 
  isFeatureActive 
}) => {
  const features = [
    {
      id: 'finetune' as const,
      icon: Sliders,
      label: 'Finetune',
    },
    {
      id: 'filter' as const,
      icon: Filter,
      label: 'Filter',
    },
  ];

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white w-16">
      {/* Reset button at top */}
      <div className="p-2 border-b border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onReset}
          className="w-full h-10 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Reset"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
      </div>

      {/* Main navigation */}
      <div className="flex-1 flex flex-col items-center py-4 space-y-2">
        {features.map((feature) => {
          const Icon = feature.icon;
          const isActive = isFeatureActive(feature.id);
          
          return (
            <Button
              key={feature.id}
              variant="ghost"
              size="sm"
              onClick={() => setActiveFeature(feature.id)}
              className={cn(
                "w-12 h-12 p-0 flex flex-col items-center justify-center space-y-1 rounded-lg",
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:text-white hover:bg-gray-800"
              )}
              title={feature.label}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs">{feature.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Save button at bottom */}
      <div className="p-2 border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSave}
          className="w-full h-10 p-0 text-gray-300 hover:text-white hover:bg-gray-800"
          title="Save"
        >
          <Save className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};

export default Navbar;