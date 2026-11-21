"use client";

import { useMemo, useState } from 'react';
import type { Post } from '@/types';
import { cn } from '@/lib/utils';
import { postTags } from '@/lib/post-content';
import { FeaturedPost, PostCard } from './PostCard';

const ACRONYMS: Record<string, string> = { ai: 'AI', ui: 'UI', ux: 'UX', api: 'API', n8n: 'n8n', nextjs: 'Next.js' };

function tabLabel(tag: string) {
  return tag.split('-').map((w) => ACRONYMS[w] ?? w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

interface FilterablePostGridProps {
  posts: Post[];
  /** Tabs shown above the grid (normalized tags). */
  tabs: string[];
}

export function FilterablePostGrid({ posts, tabs }: FilterablePostGridProps) {
  const [tab, setTab] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      if (tab && !postTags(post.tags).includes(tab)) return false;
      if (!q) return true;
      return [post.title, post.excerpt, ...(post.tags || [])].join(' ').toLowerCase().includes(q);
    });
  }, [posts, tab, query]);

  const showFeatured = !tab && !query.trim() && filtered.length > 0;
  const [featured, ...rest] = filtered;
  const gridPosts = showFeatured ? rest : filtered;

  return (
    <div>
      <div className="mb-10 mt-7 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <nav className="-mx-4 flex gap-5 overflow-x-auto px-4 text-[15px] hide-scrollbar md:mx-0 md:px-0" aria-label="Filter posts by topic">
          {[null, ...tabs].map((t) => (
            <button
              key={t ?? 'all'}
              onClick={() => setTab(t)}
              className={cn(
                'shrink-0 whitespace-nowrap transition-colors hover:text-foreground',
                tab === t ? 'text-foreground' : 'text-muted-foreground'
              )}
              aria-pressed={tab === t}
            >
              {t === null ? 'All' : tabLabel(t)}
            </button>
          ))}
        </nav>
        <label className="flex h-10 w-full items-center gap-2.5 rounded-full border border-input bg-card px-4 md:w-72">
          <span className="font-mono text-sm text-phosphor" aria-hidden="true">&gt;</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="grep posts…"
            aria-label="Search posts"
            className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
          />
        </label>
      </div>

      {showFeatured && featured && (
        <div className="mb-14">
          <FeaturedPost post={featured} label="latest" />
        </div>
      )}

      {gridPosts.length > 0 ? (
        <div className="divided-grid grid md:grid-cols-2 lg:grid-cols-3">
          {gridPosts.map((post) => <PostCard key={post.slug} post={post} />)}
        </div>
      ) : (
        !showFeatured && (
          <div className="rounded-lg border border-dashed py-16 text-center font-mono text-sm text-muted-foreground">
            <p>grep: no posts match{query ? ` "${query}"` : ''}</p>
          </div>
        )
      )}
    </div>
  );
}
