'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';
import { Footer } from './Footer';

// The radio no longer lives here: it is a module-level engine
// (src/lib/radio/engine.ts) that keeps playing across page navigations.
export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  // Splash screen with a minimum display time
  useEffect(() => {
    // Failsafe: if the load event doesn't fire, hide the splash screen anyway.
    const failsafeTimeout = setTimeout(() => setIsLoading(false), 4000);

    const handleLoad = () => {
      clearTimeout(failsafeTimeout);
      setTimeout(() => setIsLoading(false), 1800);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(failsafeTimeout);
      };
    }
  }, []);

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen onExitComplete={() => {}} />}
      </AnimatePresence>

      <motion.div
        className={cn('relative flex flex-col min-h-screen', isLoading ? 'opacity-0' : 'opacity-100')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1 w-full">{children}</div>
        <Footer />
      </motion.div>
    </>
  );
}
