
"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from 'use-debounce';
import { cn } from "@/lib/utils";
import { Search, Loader2, BookText, Code, Tag } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { SearchResult } from '@/types';

const MAX_POSTS_IN_DROPDOWN = 3;
const MAX_RESOURCES_IN_DROPDOWN = 3;
const MAX_TAGS_IN_DROPDOWN = 3;

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [isFetchingIndex, setIsFetchingIndex] = useState(false);
  const [data, setData] = useState<SearchResult[] | null>(null);
  const [results, setResults] = useState<{
    postResults: SearchResult[];
    resourceResults: SearchResult[];
    tagResults: string[];
  }>({ postResults: [], resourceResults: [], tagResults: [] });

  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchSearchIndex = async () => {
      if (!data) {
        setIsFetchingIndex(true);
        try {
          const res = await fetch('/api/search-index');
          const searchData = await res.json();
          setData(searchData);
        } catch (error) {
          console.error("Failed to fetch search index", error);
        } finally {
          setIsFetchingIndex(false);
        }
      }
    };
    if (isOpen) {
      fetchSearchIndex();
    }
  }, [isOpen, data]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults({ postResults: [], resourceResults: [], tagResults: [] });
      return;
    }

    if (data) {
      const lowerCaseQuery = debouncedQuery.toLowerCase();
      
      const posts = data.filter(item => 
          item.type === 'Post' && 
          (item.title.toLowerCase().includes(lowerCaseQuery) || item.excerpt.toLowerCase().includes(lowerCaseQuery))
      );

      const resources = data.filter(item => 
          item.type === 'Resource' && 
          (item.title.toLowerCase().includes(lowerCaseQuery) || item.excerpt.toLowerCase().includes(lowerCaseQuery))
      );
      
      const allTags = [...new Set(data.flatMap(item => Array.isArray(item.tags) ? item.tags : []))];
      const tags = allTags.filter(tag => tag && tag.toLowerCase().includes(lowerCaseQuery));

      setResults({ 
          postResults: posts, 
          resourceResults: resources, 
          tagResults: tags,
      });
    }
  }, [debouncedQuery, data]);

  const runCommand = useCallback((callback: () => void) => {
    setIsOpen(false);
    setQuery('');
    callback();
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && debouncedQuery) {
      e.preventDefault();
      runCommand(() => router.push(`/search?q=${debouncedQuery}`));
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
        inputRef.current?.focus();
      } else if (e.key === "Escape") {
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const { postResults, resourceResults, tagResults } = results;
  const totalResults = postResults.length + resourceResults.length + tagResults.length;
  const hasResults = debouncedQuery.length > 0 && totalResults > 0;

  return (
    <div ref={searchRef}>
      <Command className="relative overflow-visible bg-transparent">
        <div 
          className={cn(
            "group relative flex h-10 items-center rounded-lg border border-input bg-background cursor-pointer transition-all duration-300",
            isOpen ? "w-64 md:w-80" : "w-10",
            "focus-within:w-64 focus-within:md:w-80"
          )}
          onClick={() => {
            setIsOpen(true);
            inputRef.current?.focus();
          }}
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <CommandInput
            ref={inputRef}
            value={query}
            onValueChange={setQuery}
            onFocus={() => setIsOpen(true)}
            onKeyDown={handleKeyDown}
            placeholder="Search..."
            className={cn(
              "h-full rounded-lg text-base transition-all duration-300 ease-in-out focus:cursor-text",
              "w-full pl-10",
              "placeholder:text-sm",
              isOpen ? "opacity-100" : "opacity-0 cursor-pointer"
            )}
          />
        </div>

        {isOpen && debouncedQuery.length > 0 && (
          <CommandList 
            className="absolute top-[calc(100%_+_0.5rem)] w-[90vw] max-w-2xl rounded-lg border bg-background shadow-lg overflow-y-auto max-h-[70vh] left-1/2 -translate-x-1/2 sm:left-auto sm:translate-x-0 sm:right-0 sm:w-[400px]"
          >
            {(isFetchingIndex) ? (
              <div className="p-4 text-center text-sm flex items-center justify-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Searching...
              </div>
            ) : (!hasResults) ? (
              <CommandEmpty>No results found for &quot;{debouncedQuery}&quot;.</CommandEmpty>
            ) : null}

            {hasResults && (
              <>
                {postResults.length > 0 && (
                  <CommandGroup heading="Posts">
                    {postResults.slice(0, MAX_POSTS_IN_DROPDOWN).map(item => (
                      <CommandItem key={item.slug} value={`post-${item.slug}`} onSelect={() => runCommand(() => router.push(item.slug))}>
                        <BookText className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{item.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {resourceResults.length > 0 && (
                  <CommandGroup heading="Resources">
                    {resourceResults.slice(0, MAX_RESOURCES_IN_DROPDOWN).map(item => (
                      <CommandItem key={item.slug} value={`resource-${item.slug}`} onSelect={() => runCommand(() => window.open(item.slug, '_blank'))}>
                        <Code className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{item.title}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                {tagResults.length > 0 && (
                   <CommandGroup heading="Tags">
                    {tagResults.slice(0, MAX_TAGS_IN_DROPDOWN).map(tag => (
                      <CommandItem key={tag} value={`tag-${tag}`} onSelect={() => runCommand(() => router.push(`/posts?tag=${tag}`))}>
                        <Tag className="mr-3 h-4 w-4 text-muted-foreground" />
                        <span className="truncate">{tag}</span>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                )}
                
                <CommandGroup className="border-t pt-1 mt-1">
                    <CommandItem 
                        key="view-all"
                        value="view-all"
                        onSelect={() => runCommand(() => router.push(`/search?q=${debouncedQuery}`))} 
                        className="flex justify-start text-sm text-primary hover:text-primary/80"
                    >
                        <Search className="mr-3 h-4 w-4" />
                        View all {totalResults} results
                    </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}
