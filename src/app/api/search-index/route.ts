import { getPosts } from '@/lib/posts';
import { getResources } from '@/lib/resources';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getPosts();
    const resources = await getResources();

    const searchIndex = [
      ...posts.map(post => ({
        type: 'Post',
        title: post.title,
        excerpt: post.excerpt,
        slug: `/posts/${post.slug}`,
        thumbnail: post.imageUrl,
        tags: post.tags || [],
      })),
      ...resources.map(resource => ({
        type: 'Resource',
        title: resource.name,
        excerpt: resource.description,
        slug: resource.link,
        thumbnail: null,
        tags: [resource.category, resource.pricing],
      })),
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
