
'use client';

import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';

interface ShareOnXButtonProps {
  title: string;
  slug: string;
}

export function ShareOnXButton({ title, slug }: ShareOnXButtonProps) {
  // Use the canonical site URL from environment variables.
  // This ensures we always share the production link.
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  const handleClick = () => {
    // If the base URL isn't available for some reason, do nothing.
    if (!baseUrl) {
        console.error("Site URL is not configured. Cannot share.");
        return;
    };

    const shareUrl = `${baseUrl}/posts/${slug}`;
    const text = `Just read a great piece on Fine Coding: "${title}". A must-read for anyone interested in modern tech. #TechBlog #Developer`;
    
    const twitterIntentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;

    window.open(twitterIntentUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Button onClick={handleClick} disabled={!baseUrl} variant="outline" size="lg" className="rounded-full px-6 py-3 text-lg transition-transform hover:scale-105">
      <Twitter className="mr-2 h-5 w-5" />
      Share on X
    </Button>
  );
}
