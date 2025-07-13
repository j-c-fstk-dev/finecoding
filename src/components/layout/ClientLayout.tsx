
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
      <AnimatePresence
        mode="wait"
        onExitComplete={() => {
          document.body.style.overflow = '';
        }}
      >
        {isLoading && (
            <SplashScreen onExitComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className={cn(isLoading && 'hidden')}
      >
        {children}
      </motion.div>

      {isMounted && (
        <div
          className={cn(
            'transition-all duration-300',
            isRadioPage 
              ? 'opacity-100 visible'
              : 'opacity-0 invisible'
          )}
        >
          <div id="radio-player-container" className="w-full h-[75px] mx-auto overflow-hidden">
            <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
          </div>
        </div>
      )}
    </>
  );
}
