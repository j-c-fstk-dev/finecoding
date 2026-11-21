
import type { Metadata } from 'next';
import '@fontsource-variable/inter';
import '@fontsource/jetbrains-mono/400.css';
import '@fontsource/jetbrains-mono/500.css';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { Header } from '@/components/layout/Header';
import { GoogleAnalytics } from '@/components/analytics/GoogleAnalytics';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://finecoding.netlify.app'),
  title: {
    default: 'Fine Coding - AI, Software Craftsmanship, and Modern Development',
    template: '%s | Fine Coding',
  },
  description: 'A modern blog about software development, AI, and the art of fine coding. Exploring the frontiers of technology including vibecoding, Next.js, Genkit, and coding with AI.',
  keywords: ['Fine Coding', 'finecoding', 'AI coding', 'software development', 'Next.js blog', 'Genkit', 'vibecoding', 'coding with ai', 'tech blog', 'software craftsmanship', 'developer blog'],
  openGraph: {
    title: 'Fine Coding - AI, Software Craftsmanship, and Modern Development',
    description: 'A modern blog about software development, AI, and the art of fine coding.',
    url: '/',
    siteName: 'Fine Coding',
    images: [
      {
        url: 'https://res.cloudinary.com/dr0weongo/image/upload/v1751168647/file_00000000591c61f59c33352b1d8f37fd_ncuhov.png', // default OG image
        width: 1200,
        height: 630,
        alt: 'Fine Coding banner image',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fine Coding - AI, Software Craftsmanship, and Modern Development',
    description: 'A modern blog about software development, AI, and the art of fine coding.',
    images: ['https://res.cloudinary.com/dr0weongo/image/upload/v1751168647/file_00000000591c61f59c33352b1d8f37fd_ncuhov.png'],
  },
  alternates: {
    canonical: '/',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <GoogleAnalytics />
        <meta name="theme-color" content="#07090a" />
      </head>
      <body>
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ClientLayout>
                <Header />
                <main>{children}</main>
            </ClientLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
