import type { Metadata } from 'next';
import { RadioTerminal } from '@/components/radio/RadioTerminal';

export const metadata: Metadata = {
  title: 'Radio',
  description: 'Fine Coding Radio: generative ambient beats for coding sessions, controlled from a terminal. It keeps playing while you read the blog.',
};

// The terminal drives a generative music engine (src/lib/radio/engine.ts).
// The engine is global, so music keeps playing while you browse the blog.
export default function RadioPage() {
  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-14 sm:px-6 md:pt-20 lg:px-10">
      <header className="text-center">
        <div className="mb-5 font-mono text-[13px] text-muted-foreground/80">
          ~/fine-coding/<span className="text-phosphor">radio</span>
        </div>
        <h1 className="font-headline text-5xl font-[590] leading-none tracking-[-0.035em] text-foreground md:text-[56px]">
          Radio
        </h1>
        <p className="mx-auto mt-5 max-w-md text-[17px] leading-relaxed text-muted-foreground">
          Ambient beats for coding sessions. Pick a style, tweak it from the terminal, and keep reading: the music follows you around the blog.
        </p>
      </header>

      <section className="mx-auto mt-14 max-w-[720px]" aria-label="Radio player">
        <RadioTerminal />
        <p className="mt-4 text-center font-mono text-xs text-muted-foreground/70">
          Every note is generated live in your browser. No recordings, no ads, never the same twice.
        </p>
      </section>
    </div>
  );
}
