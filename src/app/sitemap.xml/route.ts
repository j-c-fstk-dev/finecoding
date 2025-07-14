
import { getPosts } from '@/lib/posts';
import type { Post } from '@/types';

// Use Netlify's production URL if available, otherwise fall back to the public site URL
const URL = process.env.NEXT_PUBLIC_NETLIFY_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002';

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
         const lastMod = (date instanceof Date && !isNaN(date.getTime()))
           ? date.toISOString()
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
    // Return a minimal valid sitemap on error to avoid HTML error pages
    const errorSitemap = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        <url>
          <loc>${URL}</loc>
        </url>
      </urlset>`;
    return new Response(errorSitemap, { 
      status: 500,
      headers: { 'Content-Type': 'application/xml' },
    });
  }
}
