'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { IconFC } from '@/components/icons/IconFC';

interface SplashScreenProps {
  isLoading: boolean;
}

export function SplashScreen({ isLoading }: SplashScreenProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background text-primary"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          <div className="flex flex-col items-center gap-6">
            <IconFC className="h-24 w-24 animate-pulse-glow" />
            <div className="text-center text-muted-foreground">
              <p className="text-sm">powered by @BeRegen</p>
              <p className="text-xs mt-1">all rights reserved</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
