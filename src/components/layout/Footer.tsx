import Link from 'next/link';
import { Github, Twitter } from 'lucide-react';
import { EmailSignup } from '@/components/blog/EmailSignup';
import { IconFC } from '../icons/IconFC';

export function Footer() {
  return (
    <footer className="w-full border-t border-border/40 bg-background/95">
      <div className="container mx-auto max-w-5xl px-4 py-8">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-4 flex items-center space-x-2">
              <IconFC className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">Fine Coding</span>
            </Link>
            <p className="text-center text-sm text-muted-foreground md:text-left">
              An initiative by{' '}
              <a
                href="https://beregenerativelife.wordpress.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-foreground hover:text-primary hover:underline"
              >
                @BeRegen
              </a>
              . © {new Date().getFullYear()}
            </p>
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
