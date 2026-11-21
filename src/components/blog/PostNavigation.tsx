import Link from 'next/link';
import type { Post } from '@/types';

interface PostNavigationProps {
  previousPost: Post | null;
  nextPost: Post | null;
}

function NavCard({ post, direction }: { post: Post; direction: 'previous' | 'next' }) {
  const isNext = direction === 'next';
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group block rounded-lg border bg-card p-5 transition-colors hover:border-phosphor-dim ${isNext ? 'text-right' : ''}`}
    >
      <div className="mb-2 font-mono text-xs text-muted-foreground/80">
        {isNext ? 'next →' : '← previous'}
      </div>
      <div className="font-medium leading-snug text-foreground transition-colors group-hover:text-phosphor">{post.title}</div>
    </Link>
  );
}

export function PostNavigation({ previousPost, nextPost }: PostNavigationProps) {
  if (!previousPost && !nextPost) return null;
  return (
    <nav className="grid gap-3 sm:grid-cols-2" aria-label="More posts">
      {previousPost ? <NavCard post={previousPost} direction="previous" /> : <div />}
      {nextPost ? <NavCard post={nextPost} direction="next" /> : <div />}
    </nav>
  );
}
