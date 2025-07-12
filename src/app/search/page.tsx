
"use client";

import { Suspense } from 'react';
import { SearchResults } from '@/components/search/SearchResults';
import { LoadingSpinner } from '@/components/layout/LoadingSpinner';

export default function SearchPage() {
  return (
    <div className="container mx-auto max-w-5xl px-4 py-16">
      <Suspense fallback={
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      }>
        <SearchResults />
      </Suspense>
    </div>
  );
}
