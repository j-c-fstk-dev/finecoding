
'use client';

import { useRadio } from '@/hooks/use-radio';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RadioPlayer() {
  const { isPlaying } = useRadio();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isRadioPage = pathname === '/radio';

  // The player is always rendered if isPlaying is true,
  // but it's only visible on the /radio page. On all other pages,
  // it's visually hidden but still active, allowing music to play.
  // This prevents hydration errors.
  if (!mounted || !isPlaying) {
    return null;
  }

  return (
    <div
      className={isRadioPage ? 'visible' : 'invisible h-0 w-0 overflow-hidden'}
      aria-hidden={!isRadioPage}
    >
      <div className="elfsight-app-e0d15945-5b55-4388-8217-a91bc7f38c50" data-elfsight-app-lazy></div>
    </div>
  );
}
