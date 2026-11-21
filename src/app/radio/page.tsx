import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Radio',
  description: 'Fine Coding Radio: ambient beats for coding sessions. It keeps playing while you read the blog.',
};

// The player itself is a single global instance (see ClientLayout), so music
// keeps playing while you browse. This page only draws the "monitor" around it
// and marks the slot (#radio-slot) where the player is positioned.
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
          Ambient beats for coding sessions. Press play and keep reading: the music follows you around the blog.
        </p>
      </header>

      <section className="mx-auto mt-14 max-w-[640px]" aria-label="Player">
        <div className="screen overflow-hidden rounded-xl border bg-card">
          <div className="flex items-center justify-between border-b px-4 py-2.5 font-mono text-xs text-muted-foreground/80">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              <span className="h-2 w-2 rounded-full bg-phosphor-dim" />
              <span className="h-2 w-2 rounded-full bg-input" />
              <span className="h-2 w-2 rounded-full bg-input" />
            </span>
            <span>now_playing.sh</span>
            <span className="flex items-center gap-2 text-phosphor-dim">
              <span className="radio-live-dot" aria-hidden="true" /> live
            </span>
          </div>

          <div className="cover-frame flex flex-col items-center gap-6 rounded-none border-0 px-4 py-10 sm:px-8">
            <div className="radio-eq" aria-hidden="true">
              {Array.from({ length: 24 }, (_, i) => <span key={i} style={{ animationDelay: `${(i * 137) % 900}ms` }} />)}
            </div>

            {/* The global player is positioned over this slot; its height follows the player. */}
            <div id="radio-slot" className="relative h-[75px] w-full rounded-xl border border-dashed border-input">
              <span className="radio-slot-hint absolute inset-0 flex items-center justify-center font-mono text-xs text-muted-foreground/70">
                loading player…
              </span>
            </div>

            <p className="font-mono text-xs text-muted-foreground/70">
              <span className="text-phosphor">$</span> tip: keep browsing, the radio plays in the background. Come back here to pause.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
