
'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { cn } from '@/lib/utils';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [footerStyle, setFooterStyle] = useState<CSSProperties>({ transform: 'translateY(100%)' });
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  
  // This now depends on `mounted` to avoid hydration mismatch
  const isRadioPage = mounted && pathname === '/radio';

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // This timer simulates a loading process.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Duration of the splash screen animation

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Defer footer animation until after the initial loading is complete.
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

      // When the user scrolls near the end, animate the footer into view
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

    // Initial call to set the position correctly on page load
    updateFooterPosition();

    return () => {
      window.removeEventListener('scroll', updateFooterPosition);
      window.removeEventListener('resize', updateFooterPosition);
    };
  }, [isLoading]);

  return (
    <AuthProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <AnimatePresence>
            {isLoading && <SplashScreen />}
          </AnimatePresence>
          <Header />
          <main className="flex-1 w-full relative z-10">
            {children}
          </main>
          <Footer style={footerStyle} />
          <Toaster />
          
          <div
            className={cn(
              "transition-opacity duration-300",
              isRadioPage
                ? "opacity-100 pointer-events-auto" // Visible on radio page
                : "opacity-0 pointer-events-none h-0 w-0" // Hidden on other pages
            )}
          >
            <div className="w-full max-w-3xl mx-auto h-[75px] overflow-hidden rounded-lg">
               {/* This is the only embed of Elfsight in the entire app */}
               <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
            </div>
          </div>
      </ThemeProvider>
    </AuthProvider>
  );
}
