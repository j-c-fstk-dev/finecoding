
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';
import { Footer } from './Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    const handleLoad = () => {
      setIsLoading(false);
    };

    // Check if the page is already loaded
    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      // Fallback timer in case the 'load' event fails to fire
      const timeoutId = setTimeout(handleLoad, 3000); 
      
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(timeoutId);
      };
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
      <AnimatePresence mode="wait">
        {isLoading && <SplashScreen />}
      </AnimatePresence>
      
      <motion.div
        className={cn(isLoading && 'hidden')}
        initial={{ opacity: 0 }}
        animate={{ opacity: isLoading ? 0 : 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {children}

        {/* Radio Player Container - Hidden by default, visible only on radio page */}
        <div
          className={cn(
            'transition-opacity duration-300',
            isRadioPage 
              ? 'opacity-100'
              : 'opacity-0 pointer-events-none h-0 w-0'
          )}
        >
          <div className="relative w-full h-[75px] mx-auto overflow-hidden">
            <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
          </div>
        </div>

        <Footer />
      </motion.div>
    </>
  );
}
