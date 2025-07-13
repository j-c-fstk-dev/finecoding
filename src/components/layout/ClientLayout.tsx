
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const minDisplayTime = 2000; // 2 seconds
    const startTime = Date.now();

    const handleLoad = () => {
      const elapsedTime = Date.now() - startTime;
      const remainingTime = minDisplayTime - elapsedTime;
      
      setTimeout(() => {
        setIsLoading(false);
      }, Math.max(0, remainingTime));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, []);
  
  useEffect(() => {
    if (isMounted) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.defer = true;
      script.setAttribute('data-use-service-core', '');
      
      document.body.appendChild(script);

      return () => {
        if (script.parentNode) {
            script.parentNode.removeChild(script);
        }
      }
    }
  }, [isMounted]);

  const isRadioPage = isMounted && pathname === '/radio';

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen onExitComplete={() => {}} />}
      </AnimatePresence>
      
      <motion.div
        className={cn(isLoading && 'hidden')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}

        {/* Radio Player Container - Always in DOM for persistence, visibility controlled by CSS */}
        <div
          className={cn(
            'transition-opacity duration-300',
            isRadioPage 
              ? 'opacity-100' // Visible on radio page
              : 'opacity-0 pointer-events-none' // Hidden everywhere else
          )}
        >
          {/* This div provides the placeholder for the player in the radio page layout */}
          <div id="radio-player-container" className="w-full h-[75px] mx-auto overflow-hidden">
            <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
