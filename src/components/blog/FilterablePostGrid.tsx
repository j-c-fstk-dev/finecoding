"use client";

import { useState, useMemo } from 'react';
import type { Post } from '@/types';
import { PostCard } from './PostCard';
import { TagFilter } from './TagFilter';
import { AnimatePresence, motion } from 'framer-motion';

interface FilterablePostGridProps {
  posts: Post[];
  tags: string[];
}

export function FilterablePostGrid({ posts, tags }: FilterablePostGridProps) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const filteredPosts = useMemo(() => {
    if (selectedTags.length === 0) {
      return posts;
    }
    return posts.filter(post =>
      selectedTags.every(tag => post.tags.includes(tag))
    );
  }, [posts, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div>
      <TagFilter
        tags={tags}
        selectedTags={selectedTags}
        onTagToggle={handleTagToggle}
      />
      <AnimatePresence>
        <motion.div 
            key={selectedTags.join('-')}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {filteredPosts.length > 0 ? (
            filteredPosts.map(post => (
              <PostCard key={post.slug} post={post} />
            ))
          ) : (
            <div className="col-span-full text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
                <p className="font-semibold text-lg">No posts found</p>
                <p className="text-sm mt-1">Try adjusting your tag selection.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
