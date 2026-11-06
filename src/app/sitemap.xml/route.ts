
import { getPosts } from '@/lib/posts';
import type { Post } from '@/types';

// The canonical site URL should always point to production.
const URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://finecoding.netlify.app').replace(/\/$/, '');

// Rendered on request and cached by the CDN for an hour (see Cache-Control below).
export const dynamic = 'force-dynamic';

function generateSiteMap(posts: Post[]) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!-- Add static routes -->
     <url>
       <loc>${URL}</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${URL}/posts</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${URL}/resources</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${URL}/radio</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>${URL}/about</loc>
       <lastmod>${new Date().toISOString()}</lastmod>
       <priority>0.5</priority>
     </url>
     <!-- Add dynamic routes for posts -->
     ${posts
       .map(({ slug, date }) => {
         // Defensive check to ensure we have a valid slug.
         if (!slug) {
            return ''; // Skip invalid entries
         }
         // Ensure date is valid before trying to format it.
         const lastMod = (date && new Date(date))
           ? new Date(date).toISOString()
           : new Date().toISOString();
           
         return `
       <url>
           <loc>${`${URL}/posts/${slug}`}</loc>
           <lastmod>${lastMod}</lastmod>
           <priority>0.9</priority>
       </url>
     `;
       })
       .join('')}
   </urlset>
 `;
}

export async function GET() {
  // If Firestore is unreachable this throws (HTTP 500) instead of serving a
  // sitemap without posts; crawlers simply retry later.
  const posts = await getPosts();
  const body = generateSiteMap(posts);

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
