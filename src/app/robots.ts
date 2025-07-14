import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // The siteUrl for robots.txt should always be the canonical production URL.
  const siteUrl = 'https://finecoding.netlify.app';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
