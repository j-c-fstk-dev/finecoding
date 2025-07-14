
'use client';

import { Button } from '@/components/ui/button';
import { Twitter } from 'lucide-react';

interface ShareOnXButtonProps {
  title: string;
  slug: string;
}

export function ShareOnXButton({ title, slug }: ShareOnXButtonProps) {
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/posts/${slug}`;
  const text = `Check out this article: "${title}"`;
  // The user's Twitter handle can be added here, e.g., &via=FineCodingBlog
  const twitterIntentUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`;

  const handleClick = () => {
    window.open(twitterIntentUrl, '_blank', 'width=600,height=400');
  };

  return (
    <Button onClick={handleClick} variant="outline" size="lg" className="rounded-full px-6 py-3 text-lg transition-transform hover:scale-105">
      <Twitter className="mr-2 h-5 w-5" />
      Share on X
    </Button>
  );
}
