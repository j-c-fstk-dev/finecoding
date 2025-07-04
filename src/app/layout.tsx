'use client';

import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Fine Coding</title>
        <meta name="description" content="A blog about software development, AI, and Fine Coding." />
        <meta name="theme-color" content="#1A1A1A" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Source+Code+Pro:wght@400;500&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <AuthProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
            {children}
            <Toaster />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
