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
  
  const faviconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="%231A1A1A"/><circle cx="50" cy="50" r="48" fill="none" stroke="%236B7280" stroke-width="3"/><path d="M28 25 V 75 H 38 V 57 H 48 V 47 H 38 V 35 H 52 V 25 H 28 Z" fill="%239CA3AF" /><path d="M78 28 C 68 28, 58 36, 58 50 C 58 64, 68 72, 78 72 L 78 62 C 72 62, 68 57, 68 50 C 68 43, 72 38, 78 38 Z" fill="%232C6E49" /><path d="M72 42 L 65 50 L 72 58" stroke="%239CA3AF" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" /><path d="M62 58 L 75 42" stroke="%239CA3AF" stroke-width="3.5" fill="none" stroke-linecap="round" stroke-linejoin="round" /></svg>`;
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
