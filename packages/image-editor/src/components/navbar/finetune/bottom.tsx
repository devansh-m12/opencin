import React, { useState, useCallback, useEffect } from 'react';
import { Slider } from '@workspace/ui/components/slider';
import { cn } from '@workspace/ui/lib/utils';
import { Sliders } from 'lucide-react';
import { FinetuneValues } from '../../../hooks/use-image-editor';

interface FinetuneBottomProps {
  values: FinetuneValues;
  onValueChange: (key: keyof FinetuneValues, value: number) => void;
  hasImage?: boolean;
}

const adjustmentOptions = [
  { key: 'brightness' as const, label: 'Brightness', min: -100, max: 100, step: 1 },
  { key: 'contrast' as const, label: 'Contrast', min: -100, max: 100, step: 1 },
  { key: 'saturation' as const, label: 'Saturation', min: -100, max: 100, step: 1 },
  { key: 'exposure' as const, label: 'Exposure', min: -100, max: 100, step: 1 },
  { key: 'temperature' as const, label: 'Temperature', min: -100, max: 100, step: 1 },
  { key: 'gamma' as const, label: 'Gamma', min: -100, max: 100, step: 1 },
  { key: 'clarity' as const, label: 'Clarity', min: 0, max: 100, step: 1 },
  { key: 'vignette' as const, label: 'Vignette', min: 0, max: 100, step: 1 },
] as const;

const Bottom: React.FC<FinetuneBottomProps> = ({ values, onValueChange, hasImage = false }) => {
  const [activeAdjustment, setActiveAdjustment] = useState<keyof FinetuneValues>('brightness');
  const [sliderValue, setSliderValue] = useState<number>(0);

  const currentOption = adjustmentOptions.find(option => option.key === activeAdjustment);
  const currentValue = values[activeAdjustment];

  // Update slider value when active adjustment changes
  useEffect(() => {
    setSliderValue(currentValue);
  }, [activeAdjustment, currentValue]);

  const handleSliderChange = useCallback((newValue: number[]) => {
    const value = newValue[0];
    console.log(`Slider changed: ${activeAdjustment} = ${value}`);
    setSliderValue(value);
    onValueChange(activeAdjustment, value);
  }, [activeAdjustment, onValueChange]);

  const handleAdjustmentChange = useCallback((key: keyof FinetuneValues) => {
    console.log(`Switching to adjustment: ${key}`);
    setActiveAdjustment(key);
    // Update slider value to match the new adjustment
    setSliderValue(values[key]);
  }, [values]);

  if (!hasImage) {
    return (
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center space-x-2 text-blue-400">
            <Sliders className="h-4 w-4" />
            <span className="text-sm font-medium">Finetune Adjustments</span>
          </div>
        </div>
        <div className="text-center text-gray-400 text-sm">
          Upload an image to start finetuning
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-4">
      {/* Feature indicator */}
      <div className="flex items-center justify-center mb-3">
        <div className="flex items-center space-x-2 text-blue-400">
          <Sliders className="h-4 w-4" />
          <span className="text-sm font-medium">Finetune Adjustments</span>
        </div>
      </div>

      {/* Current adjustment label */}
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-gray-300">
          {currentOption?.label}: {sliderValue}
        </span>
      </div>

      {/* Slider */}
      <div className="mb-4">
        <Slider
          value={[sliderValue]}
          onValueChange={handleSliderChange}
          min={currentOption?.min || -100}
          max={currentOption?.max || 100}
          step={currentOption?.step || 1}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-gray-300 mt-1">
          <span>{currentOption?.min}</span>
          <span>0</span>
          <span>{currentOption?.max}</span>
        </div>
      </div>

      {/* Adjustment options */}
      <div className="grid grid-cols-4 gap-1">
        {adjustmentOptions.map((option) => (
          <button
            key={option.key}
            onClick={() => handleAdjustmentChange(option.key)}
            className={cn(
              "px-2 py-1 rounded text-xs transition-colors",
              activeAdjustment === option.key
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
            )}
            title={`${option.label}: ${values[option.key]}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Bottom;