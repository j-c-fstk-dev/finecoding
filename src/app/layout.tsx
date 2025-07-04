'use client';

import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This timer simulates a loading process.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Duration of the splash screen animation

    return () => clearTimeout(timer);
  }, []);

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
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <div className="flex flex-col min-h-screen">
              <AnimatePresence>
                {isLoading && <SplashScreen />}
              </AnimatePresence>
              <Header />
              <main className="flex-1 w-full relative z-10">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
        <script dangerouslySetInnerHTML={{
          __html: `
            document.addEventListener("DOMContentLoaded", function () {
              const footer = document.getElementById("main-footer");
              if (!footer) return;

              let isScrolling = null;

              function updateFooterPosition() {
                const documentHeight = document.documentElement.scrollHeight;
                const scrollPosition = window.scrollY;
                const viewportHeight = window.innerHeight;
                
                // If content is shorter than or equal to viewport, just show the footer.
                if (documentHeight <= viewportHeight + 5) {
                    footer.style.transform = 'translateY(0%)';
                    return;
                }
                
                const isAtBottom = scrollPosition + viewportHeight >= documentHeight - 2;

                if (isAtBottom) {
                    footer.style.transform = 'translateY(0%)';
                } else {
                    footer.style.transform = 'translateY(100%)';
                }
              }

              window.addEventListener('scroll', function() {
                if (isScrolling) {
                  window.clearTimeout(isScrolling);
                }
                isScrolling = setTimeout(updateFooterPosition, 50);
              }, false);
              
              window.addEventListener('resize', updateFooterPosition);
              
              // Initial check after a short delay for content to render
              setTimeout(updateFooterPosition, 100);
            });
          `
        }}></script>
      </body>
    </html>
  );
}
