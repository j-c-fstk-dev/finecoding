
"use client";

import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Suspense>
        <SearchResults />
      </Suspense>
    </div>
  );
}
