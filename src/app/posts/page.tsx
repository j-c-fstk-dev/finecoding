import { getPosts } from '@/lib/posts';
import { FilterablePostGrid } from '@/components/blog/FilterablePostGrid';
import { topTags } from '@/lib/post-content';
import type { Metadata } from 'next';

// Re-fetch from Firestore at most every 5 minutes (ISR). Saving a post in the
// dashboard also refreshes this page immediately via revalidatePath.
export const revalidate = 300;


export const metadata: Metadata = {
  title: 'All Posts',
  description: 'Browse all articles and tutorials from Fine Coding, or filter by specific tags like AI, Next.js, and Software Development.',
  alternates: {
    canonical: '/posts',
  },
  openGraph: {
    title: 'All Posts | Fine Coding',
    description: 'Browse all articles from Fine Coding.',
    url: '/posts',
  },
  twitter: {
    title: 'All Posts | Fine Coding',
    description: 'Browse all articles from Fine Coding.',
  }
};

export default async function AllPostsPage() {
  const posts = await getPosts();
  const tabs = topTags(posts.map((p) => p.tags), 5);

  return (
    <div className="mx-auto max-w-[1280px] px-4 pb-8 pt-14 sm:px-6 md:pt-[72px] lg:px-10">
      <div className="mb-3.5 font-mono text-[13px] text-muted-foreground/80">
        ~/fine-coding/<span className="text-phosphor">posts</span>
      </div>
      <h1 className="font-headline text-5xl font-[560] leading-none tracking-[-0.035em] text-foreground md:text-[56px]">
        Posts
      </h1>
      <FilterablePostGrid posts={posts} tabs={tabs} />
    </div>
  );
}
