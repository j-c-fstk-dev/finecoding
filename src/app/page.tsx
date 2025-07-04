import { getPosts } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { CodeRain } from '@/components/layout/CodeRain';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default async function Home() {
  const posts = await getPosts();

  return (
    <>
      <CodeRain />
      <div className="relative z-10">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <section className="text-center">
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Welcome to <span className="text-primary">Fine Coding</span>
            </h1>
            <p className="mt-4 text-lg text-muted-foreground sm:text-xl">
              Exploring the frontiers of software development, AI, and modern web technologies.
            </p>
          </section>
          <section className="mt-16">
            <h2 className="font-headline text-3xl font-bold text-foreground">Recent Posts</h2>
            <div className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.slice(0, 3).map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
            {posts.length > 3 && (
              <div className="mt-12 text-center">
                <Link href="/posts" className="glowing-btn">
                  View All Posts
                  <ArrowRight />
                </Link>
              </div>
            )}
          </section>
        </div>
      </div>
    </>
  );
}
