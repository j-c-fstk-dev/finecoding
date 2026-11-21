import Link from 'next/link';
import type { Post } from '@/types';
import { formatPostDate } from '@/lib/dates';
import { primaryTag } from '@/lib/post-content';
import { SITE } from '@/lib/site';
import { PostCover } from './PostCover';

export function PostCard({ post }: { post: Post }) {
  const tag = primaryTag(post.tags);
  return (
    <article className="group">
      <Link href={`/posts/${post.slug}`} className="block">
        <PostCover seed={post.slug} className="mb-5 transition-colors group-hover:border-phosphor-dim" />
        <h3 className="font-headline text-[1.2rem] font-[520] leading-snug tracking-[-0.015em] text-foreground transition-colors group-hover:text-phosphor">
          {post.title}
        </h3>
      </Link>
      {post.excerpt && <p className="mt-2.5 text-[15px] leading-relaxed text-muted-foreground">{post.excerpt}</p>}
      <div className="mt-5 font-mono text-xs text-muted-foreground/80">
        {SITE.author} · {formatPostDate(post.date)}
        {tag && <span className="text-phosphor-dim"> · #{tag}</span>}
      </div>
    </article>
  );
}

export function FeaturedPost({ post, label = 'featured' }: { post: Post; label?: string }) {
  const tag = primaryTag(post.tags);
  return (
    <section className="group grid items-center gap-8 border-b pb-14 md:grid-cols-[1.25fr_1fr] md:gap-12">
      <Link href={`/posts/${post.slug}`} className="block">
        <PostCover seed={post.slug} className="transition-colors group-hover:border-phosphor-dim" />
      </Link>
      <div>
        <div className="mb-4 font-mono text-xs uppercase tracking-[0.12em] text-phosphor">
          {'// '}{label}{tag ? ` · ${tag.replace(/-/g, ' ')}` : ''}
        </div>
        <Link href={`/posts/${post.slug}`}>
          <h2 className="font-headline text-3xl font-[560] leading-[1.1] tracking-[-0.03em] text-foreground transition-colors group-hover:text-phosphor md:text-4xl">
            {post.title}
          </h2>
        </Link>
        {post.excerpt && <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{post.excerpt}</p>}
        <div className="mt-6 font-mono text-xs text-muted-foreground/80">
          {SITE.author} · {formatPostDate(post.date)}
        </div>
      </div>
    </section>
  );
}
