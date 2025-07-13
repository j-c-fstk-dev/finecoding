
'use client';

import { Headphones } from 'lucide-react';
import { useEffect } from 'react';

export default function RadioPage() {
  
  useEffect(() => {
    const script = document.createElement('script');
    script.src = "https://static.elfsight.com/platform/platform.js";
    script.defer = true;
    script.setAttribute('data-use-service-core', '');
    
    document.body.appendChild(script);

    return () => {
      // Clean up the script when the component unmounts
      document.body.removeChild(script);
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
        <div className="w-full h-[75px] mx-auto overflow-hidden">
           <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
        </div>
      </section>
    </div>
  );
}
