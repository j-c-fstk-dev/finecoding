
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';
import { Footer } from './Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [hasRadioScriptLoaded, setHasRadioScriptLoaded] = useState(false);

  // Effect for the splash screen with a minimum display time
  useEffect(() => {
    // This is a failsafe. If the load event doesn't fire, hide the splash screen anyway.
    const failsafeTimeout = setTimeout(() => {
      setIsLoading(false);
    }, 4000);

    const handleLoad = () => {
      clearTimeout(failsafeTimeout);
      const minDisplayTime = 1800;
      const startTime = Date.now();
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
      return () => {
        window.removeEventListener('load', handleLoad);
        clearTimeout(failsafeTimeout);
      };
    }
  }, []);
  
  // Effect to load the radio script ONCE when the user first visits the radio page.
  useEffect(() => {
    if (pathname === '/radio' && !hasRadioScriptLoaded) {
      const script = document.createElement('script');
      script.src = "https://static.elfsight.com/platform/platform.js";
      script.defer = true;
      script.setAttribute('data-use-service-core', '');
      script.onload = () => {
        setHasRadioScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Elfsight script.');
      };
      document.body.appendChild(script);

      // No cleanup function needed here, as the script should persist globally once loaded.
    }
  }, [pathname, hasRadioScriptLoaded]);
  
  const isRadioPage = useMemo(() => pathname === '/radio', [pathname]);

  // On /radio the (single, persistent) player is placed over the page's
  // #radio-slot, so it sits in the middle of the page and scrolls with it.
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [slot, setSlot] = useState<{ top: number; left: number; width: number } | null>(null);

  useEffect(() => {
    if (!isRadioPage) { setSlot(null); return; }
    const measure = () => {
      const el = document.getElementById('radio-slot');
      const wrapper = wrapperRef.current;
      if (!el || !wrapper) return;
      const r = el.getBoundingClientRect();
      const w = wrapper.getBoundingClientRect();
      setSlot({ top: r.top - w.top, left: r.left - w.left, width: r.width });
    };
    measure();
    const el = document.getElementById('radio-slot');
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);
    if (wrapperRef.current) ro.observe(wrapperRef.current);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, [isRadioPage, isLoading]);

  return (
    <>
      <AnimatePresence>
        {isLoading && <SplashScreen onExitComplete={() => {}} />}
      </AnimatePresence>
      
      <motion.div
        ref={wrapperRef}
        className={cn('relative flex flex-col min-h-screen', isLoading ? 'opacity-0' : 'opacity-100')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex-1 w-full">
          {children}
        </div>
        
        <Footer />

        {hasRadioScriptLoaded && (
          <div
            className={cn(
              'h-[75px] overflow-hidden rounded-xl transition-opacity duration-300 z-40',
              isRadioPage && slot
                ? 'absolute opacity-100 pointer-events-auto'
                : 'fixed left-1/2 -bottom-[200px] w-full max-w-lg -translate-x-1/2 opacity-0 pointer-events-none'
            )}
            style={isRadioPage && slot ? { top: slot.top, left: slot.left, width: slot.width } : undefined}
          >
            <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
          </div>
        )}
      </motion.div>
    </>
  );
}
