
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from 'use-debounce';
import { cn } from "@/lib/utils";
import { Search, Loader2, BookText, Code, ArrowRight } from "lucide-react";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import type { SearchResult } from '@/types';

export function SearchBar() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingIndex, setIsFetchingIndex] = useState(false);
  const [data, setData] = useState<SearchResult[] | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);

  // Fetch search index when component mounts or is needed
  useEffect(() => {
    async function fetchSearchIndex() {
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
    }
    fetchSearchIndex();
  }, [data]);
  
  // Handle clicks outside of the search bar to close it
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Handle Cmd/Ctrl + K to open search
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const filteredData = useMemo(() => {
    if (!data || !debouncedQuery) {
      setIsLoading(false);
      return [];
    }
    setIsLoading(true);
    const lowerCaseQuery = debouncedQuery.toLowerCase();
    const results = data.filter(item => 
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.excerpt.toLowerCase().includes(lowerCaseQuery) ||
        item.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery))
    );
    setIsLoading(false);
    return results;
  }, [debouncedQuery, data]);

  const postResults = filteredData.filter(item => item.type === 'Post').slice(0, 5);
  const resourceResults = filteredData.filter(item => item.type === 'Resource').slice(0, 5);

  const runCommand = (callback: () => void) => {
    setIsOpen(false);
    setQuery('');
    callback();
  }

  return (
    <div ref={searchRef} className="relative">
      <div 
        className={cn(
          "flex items-center w-10 h-10 transition-all duration-300 ease-in-out",
          isOpen && "w-64 md:w-80"
        )}
      >
        <Command className="relative overflow-visible bg-transparent">
          <div className="group relative flex h-10 items-center rounded-lg border border-input bg-background">
            <Search className="absolute left-3 h-5 w-5 text-muted-foreground transition-opacity duration-200" />
            <CommandInput
              value={query}
              onValueChange={setQuery}
              onFocus={() => setIsOpen(true)}
              placeholder={isOpen ? "Search posts, resources..." : ""}
              className={cn(
                "h-full cursor-pointer rounded-lg pl-10 text-base transition-all duration-300 ease-in-out focus:cursor-text",
                isOpen ? "w-full" : "w-10",
              )}
            />
          </div>

          {isOpen && (
            <CommandList className="absolute top-12 w-full rounded-lg border bg-background shadow-lg max-h-[500px] overflow-y-auto">
              {isLoading || isFetchingIndex ? (
                <div className="p-4 text-center text-sm flex items-center justify-center">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Searching...
                </div>
              ) : debouncedQuery && !filteredData.length ? (
                <CommandEmpty>No results found for &quot;{debouncedQuery}&quot;.</CommandEmpty>
              ) : (
                <>
                  {postResults.length > 0 && (
                    <CommandGroup heading="Posts">
                      {postResults.map(item => (
                        <CommandItem key={item.slug} value={item.title} onSelect={() => runCommand(() => router.push(item.slug))}>
                          <BookText className="mr-3 h-4 w-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {resourceResults.length > 0 && (
                    <CommandGroup heading="Resources">
                      {resourceResults.map(item => (
                        <CommandItem key={item.slug} value={item.title} onSelect={() => runCommand(() => window.open(item.slug, '_blank'))}>
                          <Code className="mr-3 h-4 w-4 text-muted-foreground" />
                          <span>{item.title}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                  {filteredData.length > (postResults.length + resourceResults.length) && (
                     <CommandItem onSelect={() => runCommand(() => router.push(`/search?q=${debouncedQuery}`))}>
                        <ArrowRight className="mr-3 h-4 w-4 text-primary" />
                        <span className="text-primary">View all {filteredData.length} results</span>
                     </CommandItem>
                  )}
                </>
              )}
            </CommandList>
          )}
        </Command>
      </div>
    </div>
  );
}
