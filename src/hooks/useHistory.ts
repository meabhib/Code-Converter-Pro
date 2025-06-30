
import { useState, useCallback } from 'react';

interface HistoryState {
  input: string;
  output: string;
  converter: string;
  timestamp: number;
}

export const useHistory = () => {
  const [history, setHistory] = useState<HistoryState[]>([]);
  const [currentIndex, setCurrentIndex] = useState(-1);

  const addToHistory = useCallback((state: Omit<HistoryState, 'timestamp'>) => {
    const newEntry: HistoryState = {
      ...state,
      timestamp: Date.now()
    };
    
    setHistory(prev => {
      const newHistory = [...prev.slice(0, currentIndex + 1), newEntry];
      return newHistory.slice(-50); // Keep last 50 entries
    });
    setCurrentIndex(prev => Math.min(prev + 1, 49));
  }, [currentIndex]);

  const canUndo = currentIndex > 0;
  const canRedo = currentIndex < history.length - 1;

  const undo = useCallback(() => {
    if (canUndo) {
      setCurrentIndex(prev => prev - 1);
      return history[currentIndex - 1];
    }
    return null;
  }, [canUndo, currentIndex, history]);

  const redo = useCallback(() => {
    if (canRedo) {
      setCurrentIndex(prev => prev + 1);
      return history[currentIndex + 1];
    }
    return null;
  }, [canRedo, currentIndex, history]);

  const clearHistory = useCallback(() => {
    setHistory([]);
    setCurrentIndex(-1);
  }, []);

  return {
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
    history: history.slice(0, currentIndex + 1)
  };
};
