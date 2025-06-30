"use client";

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface TagFilterProps {
  tags: string[];
  selectedTags: string[];
  onTagToggle: (tag: string) => void;
}

export function TagFilter({ tags, selectedTags, onTagToggle }: TagFilterProps) {
  return (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex w-max space-x-2 p-2">
            {tags.map(tag => (
                <Button
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    onClick={() => onTagToggle(tag)}
                    className={cn(
                        "rounded-full transition-all duration-200 ease-in-out font-code",
                        selectedTags.includes(tag) 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-transparent hover:bg-accent"
                    )}
                >
                # {tag}
                </Button>
            ))}
        </div>
        <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
