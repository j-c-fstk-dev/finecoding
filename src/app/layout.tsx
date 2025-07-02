'use client';

import './globals.css';
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';
import { IconFC } from '@/components/icons/IconFC';

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
  
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Fine Coding Blog</title>
        <meta name="description" content="A blog about software development, AI, and Fine Coding." />
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
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
