import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { EmailSignup } from '@/components/blog/EmailSignup';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-muted">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <img src="https://res.cloudinary.com/dr0weongo/image/upload/v1751503667/20250702_212403_0000_2_pp63nm.svg" alt="Fine Coding Logo" className="h-6 w-6" />
              <span className="font-bold font-headline">Fine Coding</span>
            </Link>
            <div className="text-center">
                <p className="animate-text-shine bg-gradient-to-r from-gray-400 via-white to-gray-400 bg-clip-text text-lg font-semibold text-transparent">
                    Powered by BeRegen ®
                </p>
                <p className="text-xs text-gray-500 mt-1">All rights reserved</p>
            </div>
            <div className="mt-4 flex space-x-4">
              <a href="https://github.com/j-c-fstk-dev/finecoding" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Github size={20} />
              </a>
              <a href="https://x.com/FineCodingBlog?t=Rl_dmSeMK_BiVDU3XWQdIw&s=09" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          <div className="md:col-span-2">
            <EmailSignup />
          </div>
        </div>
      </div>
    </footer>
  );
}
