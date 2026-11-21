
'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import { SplashScreen } from './SplashScreen';
import { cn } from '@/lib/utils';
import { Footer } from './Footer';

// Pixels hidden at the bottom of the Elfsight radio widget (its "Free Audio
// Player Widget" badge strip). Set to 0 to show the widget uncropped.
const RADIO_CROP_BOTTOM = 56;

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
      script.src = 'https://elfsightcdn.com/platform.js';
      script.async = true;
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

  // The widget's real height is measured on the inner element. The visible
  // box is that height minus RADIO_CROP_BOTTOM (which hides the bottom strip of
  // the widget), and the slot on /radio grows to match, so the panel always fits.
  const playerInnerRef = useRef<HTMLDivElement>(null);
  const [playerHeight, setPlayerHeight] = useState<number | null>(null);
  useEffect(() => {
    if (!hasRadioScriptLoaded) return;
    const inner = playerInnerRef.current;
    if (!inner) return;
    const sync = () => {
      const h = inner.getBoundingClientRect().height;
      setPlayerHeight(h > RADIO_CROP_BOTTOM ? Math.ceil(h - RADIO_CROP_BOTTOM) : null);
    };
    sync();
    const ro = new ResizeObserver(sync);
    ro.observe(inner);
    return () => ro.disconnect();
  }, [hasRadioScriptLoaded]);

  useEffect(() => {
    if (!isRadioPage || !playerHeight) return;
    const el = document.getElementById('radio-slot');
    if (el) el.style.height = `${playerHeight}px`;
  }, [isRadioPage, playerHeight, slot]);

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
              'overflow-hidden rounded-xl transition-opacity duration-300 z-40',
              isRadioPage && slot
                ? 'absolute opacity-100 pointer-events-auto'
                : 'fixed left-1/2 top-[110vh] w-full max-w-xl -translate-x-1/2 opacity-0 pointer-events-none'
            )}
            style={{
              ...(isRadioPage && slot ? { top: slot.top, left: slot.left, width: slot.width } : {}),
              ...(playerHeight ? { height: playerHeight } : {}),
            }}
          >
            {/* Elfsight Audio Player */}
            <div ref={playerInnerRef}>
              <div className="elfsight-app-4a2c80bc-1aac-499b-b941-fe507aad3b47" data-elfsight-app-lazy></div>
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
}
