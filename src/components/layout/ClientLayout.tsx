
'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { RadioProvider } from '@/hooks/use-radio';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RadioPlayer } from '@/components/layout/RadioPlayer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [footerStyle, setFooterStyle] = useState<CSSProperties>({ transform: 'translateY(100%)' });

  useEffect(() => {
    // This timer simulates a loading process.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Duration of the splash screen animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // This effect runs only on the client, after hydration and after the initial loading is complete.
    if (isLoading) return;

    const footer = document.getElementById("main-footer");
    if (!footer) return;

    const updateFooterPosition = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const footerHeight = footer.offsetHeight;

      // A buffer to start the reveal effect a bit earlier
      const revealBuffer = 200; 
      const revealStartPoint = documentHeight - viewportHeight - footerHeight - revealBuffer;

      // When the user scrolls near the bottom, animate the footer into view
      if (scrollPosition >= revealStartPoint) {
        const scrollProgress = (scrollPosition - revealStartPoint) / (footerHeight + revealBuffer);
        const translateYValue = (1 - Math.min(1, scrollProgress)) * 100;
        setFooterStyle({ transform: `translateY(${translateYValue}%)` });
      } else {
        // Otherwise, keep it hidden below the viewport
        setFooterStyle({ transform: 'translateY(100%)' });
      }
    };
    
    window.addEventListener('scroll', updateFooterPosition, { passive: true });
    window.addEventListener('resize', updateFooterPosition);

    // Initial call to set position correctly on page load
    updateFooterPosition();

    return () => {
      window.removeEventListener('scroll', updateFooterPosition);
      window.removeEventListener('resize', updateFooterPosition);
    };
  }, [isLoading]); // Dependency on isLoading ensures this runs only after the page is ready

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
        <RadioProvider>
          <AnimatePresence>
            {isLoading && <SplashScreen />}
          </AnimatePresence>
          <Header />
          <main className="flex-1 w-full relative z-10">
            {children}
          </main>
          <Footer style={footerStyle} />
          <RadioPlayer />
          <Toaster />
        </RadioProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
