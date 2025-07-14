import { MetadataRoute } from 'next'
 
export default function robots(): MetadataRoute.Robots {
  // Use Netlify's production URL if available, otherwise fall back to the public site URL
  const siteUrl = process.env.NEXT_PUBLIC_NETLIFY_URL || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/dashboard/'],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
