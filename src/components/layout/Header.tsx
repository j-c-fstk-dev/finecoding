"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Menu, CodeXml } from 'lucide-react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { useState, useEffect, useRef } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { IconFC } from '../icons/IconFC';

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
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-secondary py-4 dark:bg-muted/90 dark:backdrop-blur-sm">
      <div className="container flex max-w-screen-2xl flex-col items-center">
        {/* ROW 1: Title */}
        <div className="mb-4 flex items-center justify-center">
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
        
        {/* ROW 2: Nav bar */}
        <div className="flex w-full items-center justify-between">
          {/* Left Side: Navigation triggers */}
          <div>
            {/* Desktop Navigation Popover */}
            <div className="hidden md:block">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-2" align="start">
                  <nav className="flex items-center gap-2">
                    {navLinks.map(({ href, label }) => (
                      <Link
                        key={href}
                        href={href}
                        className={cn(
                          'rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          pathname === href
                            ? 'bg-accent text-accent-foreground'
                            : 'text-foreground/60'
                        )}
                      >
                        {label}
                      </Link>
                    ))}
                  </nav>
                </PopoverContent>
              </Popover>
            </div>

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
                        <SheetClose asChild key={href}>
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
                        </SheetClose>
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
          </div>

          {/* Right Side: Theme Switch for Desktop */}
          <div className="hidden md:flex">
             <ThemeSwitch />
          </div>
        </div>
      </div>
    </header>
  );
}
