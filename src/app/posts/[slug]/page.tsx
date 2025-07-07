import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'
import { getPosts } from '@/lib/posts';
import { getComments } from '@/lib/comments';
import { Badge } from '@/components/ui/badge';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { PostInteraction } from '@/components/blog/PostInteraction';

type Props = {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const posts = await getPosts();
  const post = posts.find(p => p.slug === params.slug);
 
  if (!post) {
    return {
      title: 'Post Not Found'
    }
  }

  // optionally access and extend (rather than replace) parent metadata
  const previousImages = (await parent).openGraph?.images || []
 
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/posts/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/posts/${post.slug}`,
      images: [
        {
          url: post.imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
        ...previousImages
      ],
    },
    twitter: {
        title: post.title,
        description: post.excerpt,
        images: [post.imageUrl],
    }
  }
}

export async function generateStaticParams() {
  const posts = await getPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function PostPage({ params }: { params: { slug: string } }) {
  const allPosts = await getPosts();
  const currentPostIndex = allPosts.findIndex(p => p.slug === params.slug);

  if (currentPostIndex === -1) {
    notFound();
  }

  const post = allPosts[currentPostIndex];

  if (!post || !post.id) {
    notFound();
  }

  // Determine previous and next posts (allPosts is sorted descending)
  const previousPost = allPosts[currentPostIndex + 1] || null; // Older post
  const nextPost = allPosts[currentPostIndex - 1] || null;     // Newer post

  const comments = await getComments(post.id);

  return (
    <article className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
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
      
      <PostInteraction 
        post={post} 
        initialComments={comments} 
        previousPost={previousPost} 
        nextPost={nextPost}
      />
      
    </article>
  );
}
