
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
  const [mounted, setMounted] = useState(false);
  const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);

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
  
  useEffect(() => {
    if (mounted) {
      // Carrega o script da Elfsight uma única vez
      const existingScript = document.querySelector('script[src="https://static.elfsight.com/platform/platform.js"]');
      if (!existingScript) {
        const script = document.createElement('script');
        script.src = "https://static.elfsight.com/platform/platform.js";
        script.defer = true;
        script.setAttribute('data-use-service-core', '');
        document.body.appendChild(script);
      }
    }
  }, [mounted]);

  // Encontra o portal de destino sempre que o pathname muda
  useEffect(() => {
    if (mounted) {
      setPortalTarget(document.getElementById('radio-player-target'));
    }
  }, [mounted, pathname]);

  const isRadioPage = mounted && pathname === '/radio';

  const RadioPlayer = (
    <div
      className={cn(
        'transition-opacity duration-300',
        isRadioPage ? 'opacity-100' : 'opacity-0 pointer-events-none h-0 w-0 overflow-hidden'
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
        
        {/* O player só será teletransportado se o alvo existir */}
        {portalTarget ? createPortal(RadioPlayer, portalTarget) : RadioPlayer}
      </motion.div>
    </>
  );
}
