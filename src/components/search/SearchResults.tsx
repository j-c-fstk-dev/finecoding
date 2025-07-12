
"use client";

import { useState, useMemo, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDebounce } from 'use-debounce';
import Link from 'next/link';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { BookText, Code, ExternalLink, Search as SearchIcon, ArrowLeft, Tag } from 'lucide-react';
import type { SearchResult } from '@/types';

export function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [debouncedQuery] = useDebounce(query, 300);
  const [data, setData] = useState<SearchResult[] | null>(null);

  useEffect(() => {
    async function fetchSearchIndex() {
      try {
        const res = await fetch('/api/search-index');
        const searchData = await res.json();
        setData(searchData);
      } catch (error) {
        console.error("Failed to fetch search index", error);
        setData([]);
      }
    }
    fetchSearchIndex();
  }, []);

  const { posts, resources, tags } = useMemo(() => {
    if (!data || !debouncedQuery) {
      return { posts: [], resources: [], tags: [] };
    }
    const lowerCaseQuery = debouncedQuery.toLowerCase();
    
    const postResults = data.filter(item => 
        item.type === 'Post' && 
        (item.title.toLowerCase().includes(lowerCaseQuery) || item.excerpt.toLowerCase().includes(lowerCaseQuery))
    );

    const resourceResults = data.filter(item => 
        item.type === 'Resource' && 
        (item.title.toLowerCase().includes(lowerCaseQuery) || item.excerpt.toLowerCase().includes(lowerCaseQuery))
    );
    
    const allTags = [...new Set(data.flatMap(item => Array.isArray(item.tags) ? item.tags : []))];
    const tagResults = allTags.filter(tag => tag && tag.toLowerCase().includes(lowerCaseQuery));

    return {
      posts: postResults,
      resources: resourceResults,
      tags: tagResults,
    };
  }, [debouncedQuery, data]);


  const totalResults = (posts?.length || 0) + (resources?.length || 0) + (tags?.length || 0);
  const defaultOpen = [
    ...(posts && posts.length > 0 ? ['posts'] : []),
    ...(resources && resources.length > 0 ? ['resources'] : []),
    ...(tags && tags.length > 0 ? ['tags'] : []),
  ];

  return (
    <div className="space-y-8">
      <section>
        <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="icon" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
            </Button>
            <h1 className="font-headline text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Search Results
            </h1>
        </div>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input 
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Refine your search..."
            className="pl-10 text-lg h-12"
          />
        </div>
        {debouncedQuery && (
          <p className="mt-4 text-muted-foreground">
            Found {totalResults} {totalResults === 1 ? 'result' : 'results'} for &quot;{debouncedQuery}&quot;.
          </p>
        )}
      </section>

      {totalResults > 0 ? (
        <Accordion type="multiple" defaultValue={defaultOpen} className="w-full space-y-4">
          {posts.length > 0 && (
            <AccordionItem value="posts" className="border-b-0 rounded-lg overflow-hidden border bg-muted">
              <AccordionTrigger className="text-xl font-headline hover:no-underline px-6 py-4 data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  <BookText className="h-6 w-6" /> Posts
                  <Badge variant="secondary">{posts.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 bg-background">
                <div className="pt-4 space-y-4">
                  {posts.map(post => (
                    <Link key={post.slug} href={post.slug} className="block">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                          <CardTitle>{post.title}</CardTitle>
                          <CardDescription>{post.excerpt}</CardDescription>
                        </CardHeader>
                      </Card>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {resources.length > 0 && (
            <AccordionItem value="resources" className="border-b-0 rounded-lg overflow-hidden border bg-muted">
              <AccordionTrigger className="text-xl font-headline hover:no-underline px-6 py-4 data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  <Code className="h-6 w-6" /> Resources
                  <Badge variant="secondary">{resources.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 bg-background">
                <div className="pt-4 space-y-4">
                  {resources.map(resource => (
                    <a key={resource.slug} href={resource.slug} target="_blank" rel="noopener noreferrer" className="block">
                      <Card className="hover:border-primary transition-colors">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <div>
                                    <CardTitle>{resource.title}</CardTitle>
                                    <CardDescription>{resource.excerpt}</CardDescription>
                                </div>
                                <ExternalLink className="h-4 w-4 text-muted-foreground ml-4" />
                            </div>
                        </CardHeader>
                      </Card>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}

          {tags.length > 0 && (
            <AccordionItem value="tags" className="border-b-0 rounded-lg overflow-hidden border bg-muted">
              <AccordionTrigger className="text-xl font-headline hover:no-underline px-6 py-4 data-[state=open]:border-b">
                <div className="flex items-center gap-3">
                  <Tag className="h-6 w-6" /> Tags
                  <Badge variant="secondary">{tags.length}</Badge>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-6 bg-background">
                <div className="pt-4 flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Link key={tag} href={`/posts?tag=${encodeURIComponent(tag)}`}>
                        <Badge variant="outline" className="text-base py-1 px-3 cursor-pointer hover:bg-accent"># {tag}</Badge>
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      ) : debouncedQuery ? (
        <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
          <p className="font-semibold text-lg">No results found</p>
          <p className="text-sm mt-1">Try searching for something else.</p>
        </div>
      ) : null}
    </div>
  );
}
