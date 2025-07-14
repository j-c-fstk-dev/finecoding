
'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
  const [hasRadioScriptLoaded, setHasRadioScriptLoaded] = useState(false);
  const [isRadioVisible, setIsRadioVisible] = useState(false);

  useEffect(() => {
    const minDisplayTime = 2000;
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
  
  // Effect to load the radio script ONCE.
  useEffect(() => {
    const isRadioPage = pathname === '/radio';
    if (isRadioPage && !hasRadioScriptLoaded) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.defer = true;
      script.setAttribute('data-use-service-core', '');
      script.onload = () => {
        console.log('Elfsight script loaded.');
        // Set the flag to true only after the script has successfully loaded.
        setHasRadioScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Elfsight script.');
      };
      document.body.appendChild(script);
    }
  }, [pathname, hasRadioScriptLoaded]);

  // Effect to find the portal target and control visibility.
  useEffect(() => {
    const targetEl = document.getElementById('radio-player-target');
    if (targetEl) {
      setPortalTarget(targetEl);
      setIsRadioVisible(true);
    } else {
      setIsRadioVisible(false);
    }
  }, [pathname]);

  const RadioPlayer = (
    <div
      className={cn(
        'transition-opacity duration-300',
        isRadioVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      )}
    >
      <div id="radio-player-container" className="w-full h-[75px] mx-auto overflow-hidden">
        <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
      </div>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen />}
      </AnimatePresence>
      
      <motion.div
        className={cn(isLoading && 'hidden')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}
        
        {/* Render the player structure permanently but hidden if the script has loaded */}
        {hasRadioScriptLoaded && (
          <div className="hidden">
            <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50"></div>
          </div>
        )}

        {/* Use the portal to move the visible player to the target div on the radio page */}
        {isRadioVisible && portalTarget ? createPortal(RadioPlayer, portalTarget) : null}
      </motion.div>
    </>
  );
}
