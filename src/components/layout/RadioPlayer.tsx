
'use client';

import { useRadio } from '@/hooks/use-radio';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Music } from 'lucide-react';

export function RadioPlayer() {
  const { isPlaying, stopRadio } = useRadio();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRadioPage = pathname === '/radio';

  // O player só deve ser renderizado no cliente e quando a música estiver tocando.
  if (!mounted || !isPlaying) {
    return null;
  }

  return (
    <div
      id="radio-player-container"
      className={cn(
        'transition-all duration-500 ease-in-out',
        // Estilos para quando estiver na página /radio
        isRadioPage 
          ? 'relative w-full max-w-2xl mx-auto h-auto'
          // Estilos para o mini-player flutuante em outras páginas
          : 'fixed bottom-4 right-4 z-50 w-80 h-auto shadow-2xl rounded-lg bg-background/80 backdrop-blur-sm border'
      )}
    >
        {!isRadioPage && (
            <div className="flex items-center justify-between p-2 border-b">
                <div className="flex items-center gap-2">
                    <Music className="h-4 w-4 text-primary" />
                    <p className="text-xs font-semibold text-primary">Fine Coding Radio</p>
                </div>
                <button 
                    onClick={stopRadio} 
                    className="p-1 rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label="Stop Radio"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        )}
      {/* Este é o único embed da Elfsight em todo o aplicativo */}
      <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
    </div>
  );
}
