"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Code2, Menu } from 'lucide-react';
import { ThemeSwitch } from '@/components/ui/ThemeSwitch';
import { useState } from 'react';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'All Posts' },
  { href: '/sobre', label: 'About' },
];

export function Header() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex max-w-screen-2xl flex-col items-center">
        {/* ROW 1: Title */}
        <div className="mb-4 flex items-center justify-center">
          <Link href="/" className="flex items-center space-x-2">
            <Code2 className="h-8 w-8 text-primary" />
            <span className="font-headline text-2xl font-bold sm:text-3xl">
              Fine <span className="text-primary">Coding</span>
            </span>
          </Link>
        </div>
        
        {/* ROW 2: Nav bar */}
        <div className="flex w-full items-center justify-between">
          {/* Left Side: Desktop Nav or Mobile Hamburger */}
          <div>
            {/* Desktop Navigation */}
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

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Open menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="flex flex-col">
                  <div>
                    <div className="mb-8">
                       <Link href="/" className="flex items-center space-x-2">
                          <Code2 className="h-6 w-6 text-primary" />
                          <span className="font-headline text-xl font-bold">
                            Fine <span className="text-primary">Coding</span>
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
