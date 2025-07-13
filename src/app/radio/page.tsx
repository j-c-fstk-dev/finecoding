
'use client';

import { useEffect } from 'react';
import { useRadio } from '@/hooks/use-radio';
import { Headphones } from 'lucide-react';

export default function RadioPage() {
  const { playRadio } = useRadio();

  // On mounting this page, signal that the radio should start playing.
  // The RadioPlayer component in the main layout will handle the rendering.
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
          Relaxing beats for focused coding sessions.
        </p>
      </section>
      
      <section className="mt-12">
        <p className="text-center text-muted-foreground mb-4">The player is active below and will continue playing in the background as you navigate the site.</p>
        {/* The actual player is now managed globally in ClientLayout.
            The RadioPlayer component will position itself absolutely within the viewport when on this page.
        */}
        <div className="relative min-h-[120px]">
             {/* This space ensures there's room for the player to appear without overlapping other content initially. */}
        </div>
      </section>
    </div>
  );
}
