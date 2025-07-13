
'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

interface RadioContextType {
  isPlaying: boolean;
  playRadio: () => void;
  closeRadio: () => void;
}

const RadioContext = createContext<RadioContextType | undefined>(undefined);

export function RadioProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const playRadio = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const closeRadio = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const value = useMemo(() => ({
    isPlaying,
    playRadio,
    closeRadio,
  }), [isPlaying, playRadio, closeRadio]);

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
