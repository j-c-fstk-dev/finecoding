
'use client';

import { Headphones } from 'lucide-react';

export default function RadioPage() {
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
        <div id="radio-player-container" className="w-full h-[75px] mx-auto overflow-hidden">
           {/* The radio player from ClientLayout will be positioned here via CSS when on this page */}
        </div>
      </section>
    </div>
  );
}
