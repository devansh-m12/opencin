import { useState, useCallback } from 'react';

export type NavbarFeature = 'filter' | 'finetune';

export interface NavbarState {
  // Main sidebar navigation
  activeFeature: NavbarFeature;
  
  // Optional toolbars
  showTopbar: boolean;
  showBottom: boolean;
  
  // Feature-specific states
  filter: {
    // Filter-specific state can be added here
  };
  
  finetune: {
    // Finetune-specific state can be added here
    brightness: number;
    contrast: number;
    saturation: number;
    exposure: number;
    temperature: number;
    gamma: number;
    clarity: number;
    vignette: number;
  };
}

export interface UseNavbarOptions {
  initialFeature?: NavbarFeature;
  showTopbar?: boolean;
  showBottom?: boolean;
}

export const useNavbar = (options: UseNavbarOptions = {}) => {
  const {
    initialFeature = 'finetune',
    showTopbar = true,
    showBottom = true,
  } = options;

  const [state, setState] = useState<NavbarState>({
    activeFeature: initialFeature,
    showTopbar,
    showBottom,
    filter: {},
    finetune: {
      brightness: 0,
      contrast: 0,
      saturation: 0,
      exposure: 0,
      temperature: 0,
      gamma: 0,
      clarity: 0,
      vignette: 0,
    },
  });

  // Set active feature (main sidebar navigation)
  const setActiveFeature = useCallback((feature: NavbarFeature) => {
    setState(prev => ({
      ...prev,
      activeFeature: feature,
    }));
  }, []);

  // Toggle topbar visibility
  const toggleTopbar = useCallback(() => {
    setState(prev => ({
      ...prev,
      showTopbar: !prev.showTopbar,
    }));
  }, []);

  // Toggle bottom toolbar visibility
  const toggleBottom = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBottom: !prev.showBottom,
    }));
  }, []);

  // Update finetune adjustment values
  const updateFinetuneValue = useCallback((key: keyof NavbarState['finetune'], value: number) => {
    setState(prev => ({
      ...prev,
      finetune: {
        ...prev.finetune,
        [key]: value,
      },
    }));
  }, []);

  // Reset finetune values to default
  const resetFinetune = useCallback(() => {
    setState(prev => ({
      ...prev,
      finetune: {
        brightness: 0,
        contrast: 0,
        saturation: 0,
        exposure: 0,
        temperature: 0,
        gamma: 0,
        clarity: 0,
        vignette: 0,
      },
    }));
  }, []);

  // Get current finetune values
  const getFinetuneValues = useCallback(() => {
    return state.finetune;
  }, [state.finetune]);

  // Check if a feature is active
  const isFeatureActive = useCallback((feature: NavbarFeature) => {
    return state.activeFeature === feature;
  }, [state.activeFeature]);

  return {
    // State
    state,
    
    // Main navigation
    activeFeature: state.activeFeature,
    setActiveFeature,
    isFeatureActive,
    
    // Toolbar visibility
    showTopbar: state.showTopbar,
    showBottom: state.showBottom,
    toggleTopbar,
    toggleBottom,
    
    // Finetune controls
    finetune: state.finetune,
    updateFinetuneValue,
    resetFinetune,
    getFinetuneValues,
    
    // Filter controls (placeholder for future functionality)
    filter: state.filter,
  };
}; 