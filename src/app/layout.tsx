import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { AuthProvider } from '@/lib/auth';

export const metadata: Metadata = {
  title: 'Fine Coding Blog',
  description: 'A blog about software development, AI, and Fine Coding.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#1a1a1a" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="https://placehold.co/180x180.png" />
        <link rel="icon" href='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><rect width=%22100%22 height=%22100%22 rx=%2220%22 fill=%22%231A1A1A%22/><circle cx=%2250%22 cy=%2250%22 r=%2240%22 stroke=%22%232C6E49%22 stroke-width=%223%22 fill=%22none%22/><text x=%2222%22 y=%2268%22 font-family=%22Source Code Pro, monospace%22 font-size=%2245%22 font-weight=%22500%22 fill=%22%232C6E49%22>F</text><text x=%2252%22 y=%2268%22 font-family=%22Source Code Pro, monospace%22 font-size=%2245%22 font-weight=%22500%22 fill=%22%232C6E49%22>C</text><text x=%2258%22 y=%2264%22 font-family=%22Source Code Pro, monospace%22 font-size=%2218%22 font-weight=%22500%22 fill=%22%231A1A1A%22>&lt;/&gt;</text></svg>' />
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
