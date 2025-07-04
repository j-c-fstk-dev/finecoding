import { notFound } from 'next/navigation';
import { getPostBySlug, getPosts } from '@/lib/posts';
import { getComments } from '@/lib/comments';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { Separator } from '@/components/ui/separator';
import { PostInteraction } from '@/components/blog/PostInteraction';

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  if (!post || !post.id) {
    notFound();
  }

  const comments = await getComments(post.id);

  return (
    <>
      <Header />
      <main className="flex-1 py-12 md:py-20">
        <article className="container mx-auto max-w-3xl px-4">
          <header className="mb-8">
            <h1 className="font-headline text-3xl font-extrabold tracking-tight md:text-5xl">
              {post.title}
            </h1>
            <div className="mt-4 flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                <div className="flex flex-wrap gap-1">
                  {post.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="font-code text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </header>
          <div className="prose prose-lg dark:prose-invert max-w-none font-body">
            <MarkdownRenderer content={post.content} />
          </div>
          
          <PostInteraction post={post} initialComments={comments} />
          
        </article>
      </main>
      <Footer />
    </>
  );
}
