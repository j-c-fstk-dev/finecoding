
import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ClientLayout } from '@/components/layout/ClientLayout';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:9002'),
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
        <meta name="theme-color" content="#1A1A1A" />
        <link rel="icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            <ClientLayout>
              <Header />
              <main className="flex-1 w-full relative z-10">
                {children}
              </main>
              <Footer />
            </ClientLayout>
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}