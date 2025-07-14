
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
          Relaxing beats for focused coding sessions. The player will appear at the bottom of the screen.
        </p>
      </section>
      
      <section className="mt-12">
        {/* This space is intentionally left blank. 
            The global player in ClientLayout will become visible when on this page.
            This ensures the player instance persists across navigation.
        */}
      </section>
    </div>
  );
}
