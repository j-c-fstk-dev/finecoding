"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Code2 } from 'lucide-react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'All Posts' },
  { href: '/sobre', label: 'Sobre' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-screen-2xl flex-col items-center">
        <div className="mb-4 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold sm:text-3xl">
              Fine <span className="text-primary">Coding</span>
            </span>
          </Link>
        </div>
        <div className="flex w-full items-center justify-between">
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="flex flex-1 items-center justify-end md:flex-initial">
             <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
