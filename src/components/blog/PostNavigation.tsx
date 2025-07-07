'use client';

import Link from 'next/link';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';

interface PostNavigationProps {
  previousPost: Post | null;
  nextPost: Post | null;
}

// The animated SVG arrow, adapted from the user's request.
const AnimatedArrow = ({ direction }: { direction: 'left' | 'right' }) => (
  <div className={cn('icon-arrow', direction === 'left' && 'left-arrow')}>
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <g fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" strokeMiterlimit="10">
        <circle className="arrow-icon-one" cx="16" cy="16" r="15.12"></circle>
        <path className="arrow-icon-two" d="M16.14 9.93L22.21 16l-6.07 6.07M8.23 16h13.98"></path>
      </g>
    </svg>
  </div>
);

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) {
    return null;
  }
  
  return (
    <div className="btn-container mt-16 pt-8 border-t border-border/40">
      {previousPost ? (
        <Link href={`/posts/${previousPost.slug}`} className="btn-content" title={previousPost.title}>
          <AnimatedArrow direction="left" />
          <span className="text-right truncate">
              <p className="text-sm font-normal text-muted-foreground">Previous</p>
              {previousPost.title}
          </span>
        </Link>
      ) : (
        <div /> // Empty div to maintain layout using space-between
      )}

      {nextPost ? (
        <Link href={`/posts/${nextPost.slug}`} className="btn-content" title={nextPost.title}>
          <span className="text-left truncate">
              <p className="text-sm font-normal text-muted-foreground">Next</p>
              {nextPost.title}
          </span>
          <AnimatedArrow direction="right" />
        </Link>
      ) : (
        <div /> // Empty div to maintain layout
      )}
    </div>
  );
}
