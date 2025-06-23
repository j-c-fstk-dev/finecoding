import { getPosts } from '@/lib/posts';
import { PostCard } from '@/components/blog/PostCard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function PostsPage() {
  const posts = getPosts();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto max-w-5xl px-4 py-16">
          <section>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              All Posts
            </h1>
            <p className="mt-4 text-lg text-muted-foreground">
              Browse the archives of Fine Coding.
            </p>
          </section>
          <section className="mt-12">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <PostCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
