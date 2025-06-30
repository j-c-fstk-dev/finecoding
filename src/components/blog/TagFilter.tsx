"use client";

import { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagToggle }: TagFilterProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollability = useCallback(() => {
    const el = scrollRef.current;
    if (el) {
      const isScrollable = el.scrollWidth > el.clientWidth;
      if (!isScrollable) {
        setCanScrollLeft(false);
        setCanScrollRight(false);
        return;
      }
      // Use a small buffer to prevent floating point inaccuracies
      setCanScrollLeft(el.scrollLeft > 1);
      setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      checkScrollability();
      const handleScroll = () => checkScrollability();
      const handleResize = () => checkScrollability();
      
      el.addEventListener('scroll', handleScroll, { passive: true });
      window.addEventListener('resize', handleResize);

      return () => {
        el.removeEventListener('scroll', handleScroll);
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [tags, checkScrollability]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (el) {
      const scrollAmount = el.clientWidth * 0.8;
      el.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };
  
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="relative group">
      <div 
        ref={scrollRef} 
        className="flex items-center space-x-2 overflow-x-auto py-2 hide-scrollbar"
      >
        {tags.map(tag => (
          <Button
            key={tag}
            variant={selectedTags.includes(tag) ? 'default' : 'outline'}
            onClick={() => onTagToggle(tag)}
            className={cn(
              "rounded-full transition-all duration-200 ease-in-out font-code whitespace-nowrap",
              selectedTags.includes(tag)
                ? "bg-primary text-primary-foreground"
                : "bg-transparent hover:bg-accent"
            )}
          >
            # {tag}
          </Button>
        ))}
      </div>

      {canScrollLeft && (
        <div className="absolute left-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-r from-background via-background/90 to-transparent pr-12 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 shadow-md pointer-events-auto"
            onClick={() => handleScroll('left')}
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {canScrollRight && (
        <div className="absolute right-0 top-0 bottom-0 z-10 flex items-center bg-gradient-to-l from-background via-background/90 to-transparent pl-12 pointer-events-none">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full h-8 w-8 shadow-md pointer-events-auto"
            onClick={() => handleScroll('right')}
            aria-label="Scroll right"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
