
'use client';

import { useRadio } from '@/hooks/use-radio';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X, Music } from 'lucide-react';

export function RadioPlayer() {
  const { isPlaying, stopRadio } = useRadio();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRadioPage = pathname === '/radio';

  // The player is always in the DOM if playing, but only visible on the radio page.
  if (!mounted || !isPlaying) {
    return null;
  }

  return (
    <div
      id="radio-player-container"
      className={cn(
        'transition-opacity duration-500 ease-in-out',
        // If on the radio page, make it visible and position it.
        // If not on the radio page, it remains in the DOM but is visually hidden.
        isRadioPage
          ? 'fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90vw] max-w-2xl opacity-100 h-[105px] overflow-hidden rounded-lg'
          : 'opacity-0 pointer-events-none h-0 w-0'
      )}
    >
      {/* This is the only embed of Elfsight in the entire app */}
      <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
    </div>
  );
}
