import { useId } from 'react';
import { cn } from '@/lib/utils';

/**
 * Fine Coding logo: a terminal prompt ">_" on a dark rounded tile.
 * `glow` adds the phosphor bloom (for large sizes: splash, login).
 * `bare` drops the tile and draws only the prompt in the current text color.
 */
export function LogoMark({
  className,
  glow = false,
  bare = false,
  title,
}: {
  className?: string;
  glow?: boolean;
  bare?: boolean;
  title?: string;
}) {
  const id = useId().replace(/:/g, '');
  const color = bare ? 'currentColor' : 'hsl(var(--phosphor))';
  return (
    <svg
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('shrink-0', className)}
      role={title ? 'img' : undefined}
      aria-hidden={title ? undefined : true}
      aria-label={title}
    >
      {glow && (
        <defs>
          <filter id={`glow-${id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      )}
      {!bare && (
        <rect x="1" y="1" width="62" height="62" rx="14" style={{ fill: '#07090a', stroke: '#25302d', strokeWidth: 2 }} />
      )}
      <g filter={glow ? `url(#glow-${id})` : undefined}>
        <polyline points="15,20 28,32 15,44" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="32" y="40" width="18" height="6" rx="1.5" fill={color} />
      </g>
    </svg>
  );
}
