'use client';

import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';

// Metadata is now a client-side object, not exported
// export const metadata: Metadata = { ... };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This helps prevent the splash screen from showing on every page navigation
    // in development with fast refresh. In production, it runs once.
    if (sessionStorage.getItem('splashSeen')) {
      setIsLoading(false);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('splashSeen', 'true');
      }
    }, 3000); // 3 seconds delay

    return () => clearTimeout(timer);
  }, []);
  
  // A simplified SVG for the favicon to keep the data URI small
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><g stroke="%232C6E49" fill="none"><circle cx="50" cy="50" r="48" stroke-width="3"/><path d="M30 25 v 50 M30 50 h 20" stroke-width="4.5" stroke-linecap="round"/><path d="M80 28 A 22 22 90 0 0 80 72" stroke-width="8" stroke-linecap="round"/></g><text x="68" y="55" font-family="monospace" font-size="16" fill="%232C6E49" font-weight="bold">&lt;/&gt;</text></svg>`;
  const faviconDataUri = `data:image/svg+xml,${encodeURIComponent(faviconSvg)}`;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Fine Coding Blog</title>
        <meta name="description" content="A blog about software development, AI, and Fine Coding." />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href={faviconDataUri} />
        <link rel="icon" href={faviconDataUri} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <SplashScreen isLoading={isLoading} />
             <AnimatePresence>
              {!isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.75, ease: 'easeInOut' }}
                >
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
