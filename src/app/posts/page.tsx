import { getPosts } from '@/lib/posts';
import { FilterablePostGrid } from '@/components/blog/FilterablePostGrid';
import type { Metadata } from 'next';

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
  const allTags = [...new Set(posts.flatMap(post => post.tags))].sort();

  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <section>
        <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          All Posts
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Browse all articles or filter by tags below.
        </p>
      </section>
      <section className="mt-12">
        <FilterablePostGrid posts={posts} tags={allTags} />
      </section>
    </div>
  );
}
