
'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface RadioContextType {
  isPlaying: boolean;
  playRadio: () => void;
  stopRadio: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playRadio = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const stopRadio = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const value = { isPlaying, playRadio, stopRadio };

  return (
    <RadioContext.Provider value={value}>
      {children}
    </RadioContext.Provider>
  );
}

export const useRadio = () => {
  const context = useContext(RadioContext);
  if (context === undefined) {
    throw new Error('useRadio must be used within a RadioProvider');
  }
  return context;
};
