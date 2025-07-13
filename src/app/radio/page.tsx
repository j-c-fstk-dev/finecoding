
'use client';

import { useEffect } from 'react';
import { useRadio } from '@/hooks/use-radio';
import { Headphones } from 'lucide-react';

export default function RadioPage() {
  const { playRadio } = useRadio();

  // Ao montar esta página, sinaliza que a rádio deve começar a tocar.
  // O componente RadioPlayer no layout principal cuidará da renderização.
  useEffect(() => {
    playRadio();
  }, [playRadio]);

  return (
    <div className="container mx-auto max-w-3xl px-4 py-16">
      <section className="text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Headphones className="h-8 w-8 text-primary animate-pulse" />
        </div>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          Fine Coding <span className="text-primary">Radio</span>
        </h1>
        <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
          Beats relaxantes para sessões de codificação focadas.
        </p>
      </section>
      
      <section className="mt-12">
        <p className="text-center text-muted-foreground mb-4">O player está ativo abaixo e continuará tocando em segundo plano enquanto você navega pelo site.</p>
        {/* O player real agora é gerenciado globalmente no ClientLayout e se tornará visível aqui. */}
        {/* Este espaço é um marcador visual para onde o player aparecerá. */}
        <div className="relative min-h-[400px]">
            {/* O #radio-player-container no RadioPlayer.tsx será posicionado aqui */}
        </div>
      </section>
    </div>
  );
}
