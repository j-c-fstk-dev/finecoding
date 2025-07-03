'use client';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { AnimatePresence, motion } from 'framer-motion';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This simplified logic ensures the splash screen always shows for a brief period on load,
    // avoiding hydration issues with sessionStorage.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // A bit shorter duration

    return () => clearTimeout(timer);
  }, []); // Empty dependency array ensures this runs only once on mount.
  
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
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {/* Using AnimatePresence to handle the transition between the splash screen and the main content */}
            <AnimatePresence mode="wait">
              {isLoading ? (
                <SplashScreen key="splash" />
              ) : (
                <motion.div
                  key="content"
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
