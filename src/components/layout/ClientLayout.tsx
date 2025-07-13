
'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  // This useEffect will load the Elfsight script once the component is mounted on the client.
  useEffect(() => {
    if (isMounted) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.defer = true;
      script.setAttribute('data-use-service-core', '');
      
      document.body.appendChild(script);

      return () => {
        // Clean up the script when the component unmounts
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
            <SplashScreen />
        )}
      </AnimatePresence>
      
      <div 
        onAnimationComplete={() => setIsLoading(false)}
        className={!isLoading ? 'animate-fade-in' : 'opacity-0'}
      >
        {children}
      </div>

      {/* 
        This div will always exist on the client after mount, ensuring the music persists.
        Its visibility and position are controlled by the `isRadioPage` state.
      */}
      {isMounted && (
        <div
          className={cn(
            'transition-opacity duration-300',
            isRadioPage 
              ? 'opacity-100' // Visible on radio page
              : 'opacity-0 pointer-events-none' // Hidden on other pages
          )}
        >
          <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
        </div>
      )}
    </>
  );
}
