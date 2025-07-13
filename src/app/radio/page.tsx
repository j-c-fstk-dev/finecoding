
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
        <div className="w-full h-[95px] overflow-hidden rounded-lg mx-auto">
          {/* This is the only embed of Elfsight in the entire app */}
          <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
        </div>
      </section>
    </div>
  );
}
