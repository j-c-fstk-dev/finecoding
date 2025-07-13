
'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { SplashScreen } from '@/components/layout/SplashScreen';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { RadioProvider } from '@/hooks/use-radio';
import { RadioPlayer } from './RadioPlayer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [footerStyle, setFooterStyle] = useState<CSSProperties>({ transform: 'translateY(100%)' });

  useEffect(() => {
    // Este timer simula um processo de carregamento.
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500); // Duração da animação da tela de splash

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Este efeito é executado apenas no cliente, após a hidratação e após o carregamento inicial estar completo.
    if (isLoading) return;

    const footer = document.getElementById("main-footer");
    if (!footer) return;

    const updateFooterPosition = () => {
      const documentHeight = document.documentElement.scrollHeight;
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const footerHeight = footer.offsetHeight;

      // Um buffer para iniciar o efeito de revelação um pouco antes
      const revealBuffer = 200; 
      const revealStartPoint = documentHeight - viewportHeight - footerHeight - revealBuffer;

      // Quando o usuário rola perto do final, anima o rodapé para a visão
      if (scrollPosition >= revealStartPoint) {
        const scrollProgress = (scrollPosition - revealStartPoint) / (footerHeight + revealBuffer);
        const translateYValue = (1 - Math.min(1, scrollProgress)) * 100;
        setFooterStyle({ transform: `translateY(${translateYValue}%)` });
      } else {
        // Caso contrário, mantém-no escondido abaixo da viewport
        setFooterStyle({ transform: 'translateY(100%)' });
      }
    };
    
    window.addEventListener('scroll', updateFooterPosition, { passive: true });
    window.addEventListener('resize', updateFooterPosition);

    // Chamada inicial para definir a posição corretamente no carregamento da página
    updateFooterPosition();

    return () => {
      window.removeEventListener('scroll', updateFooterPosition);
      window.removeEventListener('resize', updateFooterPosition);
    };
  }, [isLoading]); // A dependência de isLoading garante que isso seja executado apenas após a página estar pronta

  return (
    <AuthProvider>
      <RadioProvider>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
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
        </ThemeProvider>
      </RadioProvider>
    </AuthProvider>
  );
}
