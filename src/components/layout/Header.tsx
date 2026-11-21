"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { Menu, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { SearchBar } from '@/components/search/SearchBar';
import { ShareDialog } from '@/components/layout/ShareDialog';
import { LogoMark } from '@/components/icons/LogoMark';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/resources', label: 'Resources' },
  { href: '/radio', label: 'Radio' },
  { href: '/about', label: 'About' },
];

function isActive(pathname: string, href: string) {
  return href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`);
}

export function Logo({ onClick }: { onClick?: () => void }) {
  return (
    <Link href="/" onClick={onClick} className="flex items-center gap-2.5 font-mono text-[15px] font-medium tracking-tight text-foreground">
      <LogoMark className="h-7 w-7" title="Fine Coding" />
      <span>
        fine_coding<span className="terminal-cursor" aria-hidden="true" />
      </span>
    </Link>
  );
}

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 h-16 w-full border-b bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[1280px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-10">
          <Logo />

          {/* Desktop */}
          <div className="hidden items-center gap-7 md:flex">
            <nav className="flex items-center gap-7 text-[13.5px]">
              {navLinks.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn('transition-colors hover:text-foreground', isActive(pathname, href) ? 'text-foreground' : 'text-muted-foreground')}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <span className="h-[18px] w-px bg-input" aria-hidden="true" />
            <div className="flex items-center gap-2">
              <SearchBar />
              <button
                onClick={() => setIsShareOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-input text-muted-foreground transition-colors hover:text-foreground"
                aria-label="Share Website"
              >
                <Share2 className="h-4 w-4" />
              </button>
              <ThemeSwitch />
            </div>
            <a href="#newsletter" className="rounded-full bg-foreground px-3.5 py-1.5 text-[13px] font-medium text-background transition-opacity hover:opacity-85">
              Subscribe
            </a>
          </div>

          {/* Mobile */}
          <div className="flex items-center gap-2 md:hidden">
            <SearchBar />
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <button className="flex h-10 w-10 items-center justify-center rounded-lg border border-input text-muted-foreground" aria-label="Open menu">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="right" className="flex w-72 flex-col bg-background">
                <SheetTitle className="sr-only">Menu</SheetTitle>
                <Logo onClick={() => setIsMenuOpen(false)} />
                <nav className="mt-10 grid gap-1">
                  {navLinks.map(({ href, label }) => (
                    <Link
                      key={href}
                      href={href}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn('rounded-md px-2 py-2.5 font-mono text-[15px] transition-colors', isActive(pathname, href) ? 'text-foreground' : 'text-muted-foreground')}
                    >
                      <span className="mr-2 text-phosphor">{isActive(pathname, href) ? '>' : ' '}</span>
                      {label.toLowerCase()}
                    </Link>
                  ))}
                  <button
                    onClick={() => { setIsShareOpen(true); setIsMenuOpen(false); }}
                    className="rounded-md px-2 py-2.5 text-left font-mono text-[15px] text-muted-foreground"
                  >
                    <span className="mr-2"> </span>share
                  </button>
                </nav>
                <div className="mt-auto flex items-center justify-between border-t pt-4">
                  <span className="font-mono text-sm text-muted-foreground">theme</span>
                  <ThemeSwitch />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
      <ShareDialog open={isShareOpen} onOpenChange={setIsShareOpen} />
    </>
  );
}
