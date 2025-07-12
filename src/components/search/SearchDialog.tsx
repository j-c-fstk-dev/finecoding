"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDebounce } from 'use-debounce';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { BookText, Code, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  type: 'Post' | 'Resource';
  title: string;
  excerpt: string;
  slug: string;
  thumbnail: string | null;
  tags: string[];
}

export function SearchDialog({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [data, setData] = useState<SearchResult[] | null>(null);
  const [filteredData, setFilteredData] = useState<SearchResult[]>([]);

  useEffect(() => {
    async function fetchSearchIndex() {
      if (!data) {
        setLoading(true);
        try {
          const res = await fetch('/api/search-index');
          const searchData = await res.json();
          setData(searchData);
        } catch (error) {
          console.error("Failed to fetch search index", error);
        } finally {
          setLoading(false);
        }
      }
    }
    if (open) {
      fetchSearchIndex();
    }
  }, [open, data]);

  useEffect(() => {
    if (!data || !debouncedQuery) {
      setFilteredData([]);
      return;
    }

    const lowerCaseQuery = debouncedQuery.toLowerCase();
    const results = data.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
    setFilteredData(results);
  }, [debouncedQuery, data]);

  const handleSelect = useCallback(() => {
    onOpenChange(false);
    setQuery("");
  }, [onOpenChange]);

  const postResults = filteredData.filter(item => item.type === 'Post');
  const resourceResults = filteredData.filter(item => item.type === 'Resource');

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput
        placeholder="Search posts, resources, and tags..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {loading && <div className="p-4 text-center text-sm flex items-center justify-center"><Loader2 className="mr-2 h-4 w-4 animate-spin" />Loading Index...</div>}
        {!loading && debouncedQuery.length === 0 && <CommandEmpty>Start typing to search.</CommandEmpty>}
        {!loading && debouncedQuery.length > 0 && filteredData.length === 0 && <CommandEmpty>No results found.</CommandEmpty>}

        {postResults.length > 0 && (
          <CommandGroup heading="Posts">
            {postResults.map((item) => (
              <Link key={`post-${item.slug}`} href={item.slug} passHref>
                <CommandItem onSelect={handleSelect} className="cursor-pointer">
                  <div className="flex items-center gap-4">
                    {item.thumbnail ? (
                       <Image
                        src={item.thumbnail}
                        alt={item.title}
                        width={48}
                        height={48}
                        className="rounded-md object-cover h-12 w-12"
                        data-ai-hint="blog post"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <BookText className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</span>
                    </div>
                  </div>
                </CommandItem>
              </Link>
            ))}
          </CommandGroup>
        )}

        {resourceResults.length > 0 && (
            <CommandGroup heading="Resources">
            {resourceResults.map((item) => (
              <a key={`resource-${item.slug}`} href={item.slug} target="_blank" rel="noopener noreferrer">
                <CommandItem onSelect={handleSelect} className="cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted">
                        <Code className="h-6 w-6 text-muted-foreground" />
                      </div>
                    <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-muted-foreground line-clamp-2">{item.excerpt}</span>
                    </div>
                  </div>
                </CommandItem>
              </a>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
}
