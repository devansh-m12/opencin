import { useState, useCallback } from 'react';

export interface HistoryState {
  canvas: any;
  timestamp: number;
}

export const useImageHistory = (canvas: any) => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [maxHistorySize] = useState(50); // Maximum number of history states to keep

  const saveState = useCallback(() => {
    if (!canvas) return;

    try {
      // Create a JSON representation of the canvas state
      const canvasState = canvas.toJSON();
      const newState: HistoryState = {
        canvas: canvasState,
        timestamp: Date.now(),
      };

      setHistory(prev => {
        // Remove any states after current index (when we're not at the end)
        const newHistory = prev.slice(0, currentIndex + 1);
        
        // Add new state
        newHistory.push(newState);
        
        // Limit history size
        if (newHistory.length > maxHistorySize) {
          newHistory.shift();
        }
        
        return newHistory;
      });

      setCurrentIndex(prev => Math.min(prev + 1, maxHistorySize - 1));
    } catch (error) {
      console.error('Failed to save history state:', error);
    }
  }, [canvas, currentIndex, maxHistorySize]);

  const undo = useCallback(() => {
    if (!canvas || currentIndex <= 0) return;

    try {
      const newIndex = currentIndex - 1;
      const stateToRestore = history[newIndex];
      
      if (stateToRestore) {
        canvas.loadFromJSON(stateToRestore.canvas, () => {
          canvas.renderAll();
          setCurrentIndex(newIndex);
        });
      }
    } catch (error) {
      console.error('Failed to undo:', error);
    }
  }, [canvas, currentIndex, history]);

  const redo = useCallback(() => {
    if (!canvas || currentIndex >= history.length - 1) return;

    try {
      const newIndex = currentIndex + 1;
      const stateToRestore = history[newIndex];
      
      if (stateToRestore) {
        canvas.loadFromJSON(stateToRestore.canvas, () => {
          canvas.renderAll();
          setCurrentIndex(newIndex);
        });
      }
    } catch (error) {
      console.error('Failed to redo:', error);
    }
  }, [canvas, currentIndex, history]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  const getHistoryInfo = useCallback(() => {
    return {
      totalStates: history.length,
      currentIndex,
      canUndo,
      canRedo,
      maxHistorySize,
    };
  }, [history.length, currentIndex, canUndo, canRedo, maxHistorySize]);

  return {
    saveState,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    getHistoryInfo,
  };
}; 