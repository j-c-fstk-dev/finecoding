
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, CodeXml } from 'lucide-react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { SearchBar } from '@/components/search/SearchBar';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'All Posts' },
  { href: '/resources', label: 'Resources' },
  { href: '/about', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGlitching, setIsGlitching] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const scheduleGlitch = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      const randomDelay = Math.random() * 4000 + 8000; // 8 to 12 seconds

      timeoutRef.current = setTimeout(() => {
        setIsGlitching(true);
        setTimeout(() => {
          setIsGlitching(false);
        }, 300); // Duration of the glitch animation
        scheduleGlitch();
      }, randomDelay);
    };

    scheduleGlitch();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <header 
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm"
      style={{ '--header-height': '7rem' } as React.CSSProperties}
    >
      <div className="container relative flex h-28 max-w-screen-2xl items-center">
        
        {/* Left Side: Mobile Menu Sheet & Desktop Popover */}
        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center">
          {/* Mobile Navigation Sheet */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col bg-background/90 backdrop-blur-sm">
                <div>
                  <div className="mb-8">
                      <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <span className={cn('glitch-icon', { 'is-glitching': isGlitching })}>
                            <CodeXml className="h-6 w-6 text-primary" />
                        </span>
                        <span className="font-headline text-xl font-bold">
                          Fine{' '}
                            <span
                              className={cn('glitch-text text-primary', { 'is-glitching': isGlitching })}
                              data-glitch="Coding"
                            >
                              Coding
                            </span>
                        </span>
                      </Link>
                  </div>
                  <nav className="grid gap-4">
                    {navLinks.map(({ href, label }) => (
                      <SheetTrigger asChild key={href}>
                        <Link
                          href={href}
                          className={cn(
                            'text-lg text-muted-foreground transition-colors hover:text-foreground',
                            pathname === href && 'text-foreground'
                          )}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {label}
                        </Link>
                      </SheetTrigger>
                    ))}
                  </nav>
                </div>
                <div className="mt-auto border-t border-border/40 pt-4">
                  <div className="flex items-center justify-between">
                      <span className="text-lg text-muted-foreground">Change Theme</span>
                      <ThemeSwitch />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop Navigation Button */}
          <div className="hidden md:block">
            <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
            </Button>
          </div>
        </div>

        {/* Center: Title */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Link href="/" className="flex items-center space-x-2">
            <span className={cn('glitch-icon', { 'is-glitching': isGlitching })}>
                <CodeXml className="h-8 w-8 text-primary transition-colors" />
            </span>
            <span className="font-headline text-2xl font-bold sm:text-3xl">
              Fine{' '}
              <span
                className={cn('glitch-text text-primary', { 'is-glitching': isGlitching })}
                data-glitch="Coding"
              >
                Coding
              </span>
            </span>
          </Link>
        </div>

        {/* Right Side: Search and Theme Switch */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-end gap-y-2">
            <ThemeSwitch />
            <SearchBar />
        </div>
      </div>
    </header>
  );
}
