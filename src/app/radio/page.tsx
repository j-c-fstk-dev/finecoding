
'use client';

import { Headphones } from 'lucide-react';
import { useEffect } from 'react';

export default function RadioPage() {
  
  useEffect(() => {
    // This script is already loaded in ClientLayout, but calling it here
    // ensures the widget initializes if it hasn't already.
    // The main purpose of this page is to provide a UI for the player.
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.defer = true;
    document.body.appendChild(script);

    return () => {
      // It's generally not recommended to remove the script on cleanup
      // as it might manage global state for the player.
    }
  }, []);

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
        {/* 
          This div is now a placeholder for the global player to become visible.
          The actual player logic is in ClientLayout to persist across pages.
          We just provide a sized box here.
        */}
        <div className="w-full h-[75px] mx-auto" />
      </section>
    </div>
  );
}
