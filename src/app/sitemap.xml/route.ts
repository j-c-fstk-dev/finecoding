
import { getPosts } from '@/lib/posts';
import type { Post } from '@/types';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add static routes -->
     <url>
       <loc>${URL}</loc>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${URL}/posts</loc>
       <priority>0.8</priority>
     </url>
      <url>
       <loc>${URL}/resources</loc>
       <priority>0.8</priority>
     </url>
      <url>
       <loc>${URL}/about</loc>
       <priority>0.5</priority>
     </url>
     <!-- Add dynamic routes for posts -->
     ${posts
       .map(({ slug, date }) => {
         // Defensive check to ensure we have a valid slug and date
         if (!slug || !date || !(date instanceof Date) || isNaN(date.getTime())) {
            return ''; // Skip invalid entries
         }
         return `
       <url>
           <loc>${`${URL}/posts/${slug}`}</loc>
           <lastmod>${date.toISOString()}</lastmod>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  try {
    const posts = await getPosts();
    const body = generateSiteMap(posts);

    return new Response(body, {
      status: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 's-maxage=86400, stale-while-revalidate', // Cache for 24 hours
      },
    });
  } catch (error) {
    console.error('Failed to generate sitemap:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
