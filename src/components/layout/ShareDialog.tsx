
'use client';

import { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Copy, Share2, Twitter, Check } from 'lucide-react';

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareDialog({ open, onOpenChange }: ShareDialogProps) {
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Use the canonical site URL from environment variables.
  // This ensures we always share the production link.
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const shareData = {
    title: 'Fine Coding',
    text: "Diving into the world of software craftsmanship and AI. Check out Fine Coding for articles and resources on modern development. #FineCoding #SoftwareDevelopment #AI",
    url: siteUrl,
  };

  const copyToClipboard = () => {
    if (!siteUrl) return;
    navigator.clipboard.writeText(siteUrl).then(() => {
      toast({ title: 'Link copied to clipboard!' });
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      toast({ title: 'Failed to copy link', description: err.message, variant: 'destructive' });
    });
  };

  const nativeShare = async () => {
    if (!siteUrl) return;
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Couldn't share using Web Share API:", err);
      }
    } else {
        toast({ title: "Web Share not supported", description: "Your browser doesn't support the native share feature. Please copy the link instead."})
    }
  };

  const shareOnX = () => {
    if (!siteUrl) return;
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareData.url)}&text=${encodeURIComponent(shareData.text)}`;
    window.open(twitterUrl, '_blank', 'width=600,height=400');
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">Share Fine Coding</DialogTitle>
          <DialogDescription className="text-center">
            Scan the QR code or use the options below to share.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-6 py-4">
          <div className="rounded-lg border-4 border-primary p-2 bg-white">
            {isMounted && siteUrl ? (
                <QRCode
                    value={siteUrl}
                    size={160}
                    bgColor="#FFFFFF" // Always use white background for better scannability
                    fgColor="#000000" // Always use black foreground
                    level="H"
                    includeMargin={false}
                />
            ) : (
                <div className="h-[160px] w-[160px] bg-muted animate-pulse rounded-sm" />
            )}
          </div>
          <div className="flex w-full items-center space-x-2">
            <Input id="link" value={siteUrl} readOnly className="flex-1" />
            <Button type="button" size="icon" onClick={copyToClipboard} disabled={!siteUrl} aria-label="Copy link">
              {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <div className="grid w-full grid-cols-2 gap-2">
             <Button onClick={shareOnX} variant="outline" disabled={!siteUrl}>
                <Twitter className="mr-2 h-4 w-4" /> Share on X
             </Button>
             <Button onClick={nativeShare} disabled={!siteUrl}>
                <Share2 className="mr-2 h-4 w-4" /> More Options
             </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
