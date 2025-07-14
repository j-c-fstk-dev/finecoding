
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';

interface ShareOnXButtonProps {
  title: string;
  slug: string;
}

export function ShareOnXButton({ title, slug }: ShareOnXButtonProps) {
  const [baseUrl, setBaseUrl] = useState('');

  useEffect(() => {
    // Set base URL from window.location on the client side
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin);
    }
  }, []);
  
  const handleClick = () => {
    if (!baseUrl) return; // Don't do anything if base URL isn't set yet

    const shareUrl = `${baseUrl}/posts/${slug}`;
    // More performant and original tweet text
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
