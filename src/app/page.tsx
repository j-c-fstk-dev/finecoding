import Link from 'next/link';
import type { Metadata } from 'next';
import { getPosts } from '@/lib/posts';
import { FeaturedPost, PostCard } from '@/components/blog/PostCard';
import { CodeRain } from '@/components/layout/CodeRain';
import { SITE } from '@/lib/site';

// Re-fetch from Firestore at most every 5 minutes (ISR). Saving a post in the
// dashboard also refreshes this page immediately via revalidatePath.
export const revalidate = 300;

// Title and description come from the root layout.
export const metadata: Metadata = {};

export default async function Home() {
  const posts = await getPosts();
  const [latest, ...others] = posts;
  const recent = others.slice(0, 6);

  return (
    <>
      <CodeRain />
      <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-16 sm:px-6 md:pt-24 lg:px-10">
        <section className="max-w-3xl">
          <div className="mb-5 font-mono text-[13px] text-muted-foreground/80">
            ~/<span className="text-phosphor">fine-coding</span>
          </div>
          <h1 className="font-headline text-5xl font-[560] leading-[1.02] tracking-[-0.04em] text-foreground md:text-7xl">
            Code with AI.
            <br />
            <span className="text-phosphor phosphor-glow">Understand</span> what you ship.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">{SITE.description}</p>
        </section>

        {latest && (
          <div className="mt-16 md:mt-24">
            <FeaturedPost post={latest} label="latest" />
          </div>
        )}

        {recent.length > 0 && (
          <section className="mt-14">
            <div className="mb-10 flex items-baseline justify-between">
              <h2 className="font-headline text-3xl font-[560] tracking-[-0.03em] text-foreground md:text-4xl">Recent posts</h2>
              <Link href="/posts" className="font-mono text-sm text-muted-foreground transition-colors hover:text-phosphor">
                ls ./posts →
              </Link>
            </div>
            <div className="divided-grid grid md:grid-cols-2 lg:grid-cols-3">
              {recent.map((post) => <PostCard key={post.slug} post={post} />)}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
