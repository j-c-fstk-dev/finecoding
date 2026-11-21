'use client';

import Link from 'next/link';
import { useSyncExternalStore } from 'react';
import { DEFAULT_STATE, radio } from '@/lib/radio/engine';

/** Small "now playing" pill in the header, visible on every page while the radio plays. */
export function RadioIndicator() {
  const state = useSyncExternalStore(radio.subscribe, radio.getState, () => DEFAULT_STATE);
  if (state.status !== 'playing') return null;
  return (
    <div className="flex h-8 items-center overflow-hidden rounded-full border border-phosphor-dim font-mono text-xs">
      <Link href="/radio" className="flex items-center gap-1.5 pl-3 pr-2 text-phosphor" title="Open the radio">
        <span className="radio-live-dot" aria-hidden="true" />
        {state.style} · {state.bpm}
      </Link>
      <button
        onClick={() => radio.stop()}
        className="h-full border-l border-phosphor-dim px-2.5 text-muted-foreground transition-colors hover:text-foreground"
        aria-label="Stop the radio"
        title="Stop"
      >
        ■
      </button>
    </div>
  );
}
