import { notFound } from 'next/navigation';
import type { Metadata, ResolvingMetadata } from 'next'
import { getPosts } from '@/lib/posts';
import { getComments } from '@/lib/comments';
import Link from 'next/link';
import { formatPostDate } from '@/lib/dates';
import { extractToc, primaryTag, readingMinutes, splitPostContent } from '@/lib/post-content';
import { SITE } from '@/lib/site';
import { PostCover } from '@/components/blog/PostCover';
import { MarkdownRenderer } from '@/components/blog/MarkdownRenderer';
import { PostInteraction } from '@/components/blog/PostInteraction';

// Re-fetch from Firestore at most every 5 minutes (ISR). Saving a post in the
// dashboard also refreshes this page immediately via revalidatePath.
export const revalidate = 300;


type Props = {
  params: Promise<{ slug: string }>
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const posts = await getPosts();
  const { slug } = await params;
  const post = posts.find(p => p.slug === slug);
 
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

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const allPosts = await getPosts();
  const currentPostIndex = allPosts.findIndex(p => p.slug === slug);

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

  const { headline, body } = splitPostContent(post.content);
  const toc = extractToc(body);
  const tag = primaryTag(post.tags);

  return (
    <article className="mx-auto max-w-[1280px] px-4 pb-8 pt-14 sm:px-6 md:pt-20 lg:px-10">
      <header className="text-center">
        <div className="mb-5 font-mono text-[13px] text-muted-foreground/80">
          <Link href="/posts" className="transition-colors hover:text-foreground">posts</Link>
          {tag && (
            <>
              {' / '}
              <span className="text-muted-foreground">{tag.replace(/-/g, ' ')}</span>
            </>
          )}
        </div>
        <h1 className="mx-auto max-w-[880px] font-headline text-4xl font-[590] leading-[1.05] tracking-[-0.035em] text-foreground md:text-[52px]">
          {headline ?? post.title}
        </h1>
      </header>

      <PostCover seed={post.slug} className="mx-auto mb-10 mt-12 max-w-[880px] md:mt-14" />

      <div className="mb-14 text-center text-[15px] text-muted-foreground">
        {SITE.author}
        <span className="mx-2.5 text-muted-foreground/50">·</span>
        {formatPostDate(post.date)}
        <span className="mx-2.5 text-muted-foreground/50">·</span>
        <span className="font-mono text-[12.5px] text-phosphor-dim">{readingMinutes(body)} min read</span>
      </div>

      <div className="relative mx-auto max-w-[640px]">
        {toc.length > 1 && (
          <aside className="absolute left-[calc(100%+72px)] top-0 hidden h-full w-52 xl:block">
            <nav className="sticky top-24 text-[13px]" aria-label="On this page">
              <div className="mb-3.5 font-mono text-[11.5px] uppercase tracking-[0.12em] text-muted-foreground/80">On this page</div>
              {toc.map((h) => (
                <a key={h.id} href={`#${h.id}`} className="mb-2.5 block leading-snug text-muted-foreground transition-colors hover:text-foreground">
                  {h.text}
                </a>
              ))}
            </nav>
          </aside>
        )}

        <div className="article-prose">
          <MarkdownRenderer content={body} />
        </div>

        <PostInteraction
          post={post}
          initialComments={comments}
          previousPost={previousPost}
          nextPost={nextPost}
        />
      </div>
    </article>
  );
}
