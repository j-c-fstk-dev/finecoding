'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import Script from 'next/script';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const gaId = process.env.NEXT_PUBLIC_GA_ID;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Fine Coding</title>
        <meta name="description" content="A blog about software development, AI, and Fine Coding." />
        <meta name="theme-color" content="#1A1A1A" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}');
                `,
              }}
            />
          </>
        )}
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
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
