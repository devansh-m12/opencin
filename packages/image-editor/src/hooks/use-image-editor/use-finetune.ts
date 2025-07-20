import { useState, useCallback } from 'react';
import type { FinetuneValues } from './types';

export const useFinetune = (canvas: any) => {
  const [finetuneValues, setFinetuneValues] = useState<FinetuneValues>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    exposure: 0,
    temperature: 0,
    gamma: 0,
    clarity: 0,
    vignette: 0,
  });

  const applyFinetuneEffect = useCallback((key: keyof FinetuneValues, value: number) => {
    if (!canvas || typeof window === 'undefined') return;

    try {
      // Get the background image
      const backgroundImage = canvas.backgroundImage;
      if (!backgroundImage) return;

      // Initialize filters array if it doesn't exist
      if (!backgroundImage.filters) {
        backgroundImage.filters = [];
      }

      // Helper function to remove existing filter for a specific adjustment type
      const removeExistingFilter = (adjustmentType: string) => {
        const filterIndex = backgroundImage.filters.findIndex((filter: any) => 
          filter._adjustmentType === adjustmentType
        );
        
        if (filterIndex !== -1) {
          backgroundImage.filters.splice(filterIndex, 1);
          return true;
        }
        return false;
      };

      // Remove existing filter for this adjustment if it exists
      removeExistingFilter(key);

      // Only apply filter if value is not 0 (neutral)
      let shouldApplyFilter = false;
      let filterToApply: any = null;

      // Apply different effects based on the key
      switch (key) {
        case 'brightness':
          if (value !== 0) {
            const brightnessValue = Math.max(-0.4, Math.min(0.4, value / 250));
            filterToApply = new window.fabric.Image.filters.Brightness({
              brightness: brightnessValue
            });
            filterToApply._adjustmentType = 'brightness';
            shouldApplyFilter = true;
          }
          break;

        case 'contrast':
          if (value !== 0) {
            const contrastValue = Math.max(-0.4, Math.min(0.4, value / 250));
            filterToApply = new window.fabric.Image.filters.Contrast({
              contrast: contrastValue
            });
            filterToApply._adjustmentType = 'contrast';
            shouldApplyFilter = true;
          }
          break;

        case 'saturation':
          if (value !== 0) {
            const saturationValue = Math.max(-0.5, Math.min(0.5, value / 200));
            filterToApply = new window.fabric.Image.filters.Saturation({
              saturation: saturationValue
            });
            filterToApply._adjustmentType = 'saturation';
            shouldApplyFilter = true;
          }
          break;

        case 'exposure':
          if (value !== 0) {
            const exposureValue = Math.max(-0.3, Math.min(0.3, value / 333));
            filterToApply = new window.fabric.Image.filters.Brightness({
              brightness: exposureValue
            });
            filterToApply._adjustmentType = 'exposure';
            shouldApplyFilter = true;
          }
          break;

        case 'temperature':
          if (value > 0) {
            const alphaValue = Math.min(0.3, value / 333);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#ff8c00',
              mode: 'tint',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'temperature';
            shouldApplyFilter = true;
          } else if (value < 0) {
            const alphaValue = Math.min(0.3, Math.abs(value) / 333);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#0066cc',
              mode: 'tint',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'temperature';
            shouldApplyFilter = true;
          }
          break;

        case 'gamma':
          if (value !== 0) {
            const gammaValue = Math.max(0.6, Math.min(1.4, 1 + (value / 250)));
            filterToApply = new window.fabric.Image.filters.Gamma({
              gamma: [gammaValue, gammaValue, gammaValue]
            });
            filterToApply._adjustmentType = 'gamma';
            shouldApplyFilter = true;
          }
          break;

        case 'clarity':
          if (value > 0) {
            const opacityValue = Math.min(0.4, value / 250);
            filterToApply = new window.fabric.Image.filters.Convolute({
              matrix: [0, -1, 0, -1, 5, -1, 0, -1, 0],
              opacity: opacityValue
            });
            filterToApply._adjustmentType = 'clarity';
            shouldApplyFilter = true;
          }
          break;

        case 'vignette':
          if (value > 0) {
            const alphaValue = Math.min(0.4, value / 250);
            filterToApply = new window.fabric.Image.filters.BlendColor({
              color: '#000000',
              mode: 'multiply',
              alpha: alphaValue
            });
            filterToApply._adjustmentType = 'vignette';
            shouldApplyFilter = true;
          }
          break;
      }

      // Apply the filter if we have one
      if (shouldApplyFilter && filterToApply) {
        backgroundImage.filters.push(filterToApply);
      }

      // Apply filters and render
      backgroundImage.applyFilters();
      canvas.renderAll();

    } catch (error) {
      console.error('Error applying finetune effect:', error);
    }
  }, [canvas]);

  const updateFinetuneValue = useCallback((key: keyof FinetuneValues, value: number) => {
    if (!canvas) return;

    // Update the state immediately for UI responsiveness
    setFinetuneValues(prev => ({
      ...prev,
      [key]: value,
    }));

    // Apply the finetune effect immediately
    applyFinetuneEffect(key, value);
  }, [canvas, applyFinetuneEffect]);

  const resetFinetune = useCallback(() => {
    if (!canvas) return;

    const resetValues: FinetuneValues = {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      gamma: 0,
      clarity: 0,
      vignette: 0,
    };

    setFinetuneValues(resetValues);

    // Clear all filters from the background image
    if (canvas.backgroundImage) {
      // Clear the filters array completely
      canvas.backgroundImage.filters = [];
      
      // Apply the cleared filters to update the image
      canvas.backgroundImage.applyFilters();
      
      // Re-render the canvas
      canvas.renderAll();
    }
  }, [canvas]);

  const getFilterStatus = useCallback(() => {
    if (!canvas?.backgroundImage?.filters) return [];
    
    return canvas.backgroundImage.filters.map((filter: any, index: number) => ({
      index,
      type: filter.constructor.name,
      adjustmentType: filter._adjustmentType,
      properties: Object.keys(filter).filter(key => !key.startsWith('_'))
    }));
  }, [canvas]);

  const refreshFilters = useCallback(() => {
    if (!canvas?.backgroundImage) return;
    
    canvas.backgroundImage.applyFilters();
    canvas.renderAll();
  }, [canvas]);

  return {
    finetuneValues,
    updateFinetuneValue,
    resetFinetune,
    getFilterStatus,
    refreshFilters,
  };
}; 