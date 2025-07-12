
import { getPosts } from '@/lib/posts';
import { getResources } from '@/lib/resources';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getPosts();
    const resources = await getResources();

    const searchIndex = [
      ...posts.map(post => {
        // Defensive check to ensure we only index valid posts
        if (!post || !post.title || !post.slug) {
          return null;
        }
        return {
          type: 'Post' as const,
          title: post.title,
          excerpt: post.excerpt || '',
          slug: `/posts/${post.slug}`,
          thumbnail: post.imageUrl || null,
          tags: Array.isArray(post.tags) ? post.tags : [],
        }
      }).filter(Boolean), // Filter out any null entries
      ...resources.map(resource => {
         if (!resource || !resource.name || !resource.link) {
          return null;
        }
        return {
          type: 'Resource' as const,
          title: resource.name,
          excerpt: resource.description || '',
          slug: resource.link,
          thumbnail: null,
          tags: [resource.category, resource.pricing].filter(Boolean) as string[],
        }
      }).filter(Boolean),
    ];

    return NextResponse.json(searchIndex, {
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=59',
      },
    });
  } catch (error) {
    console.error('Failed to generate search index:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
