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
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
        >
          {/* Main content area, positioned slightly above center */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-3/4">
            <div className="flex h-48 w-48 items-center justify-center rounded-full bg-primary/10">
              <IconFC className="h-32 w-32 animate-pulse-glow text-primary" />
            </div>
          </div>

          {/* Footer text at the bottom */}
          <div className="absolute bottom-12 text-center">
            <p className="bg-gradient-to-r from-[hsl(var(--primary))] to-yellow-500 bg-clip-text text-lg font-semibold text-transparent">
              Powered by BeRegen ®
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
