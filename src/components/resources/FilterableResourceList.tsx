"use client";

import { useState, useMemo } from 'react';
import type { Resource, ResourceCategory } from '@/types';
import { resourceCategories } from '@/types';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ResourceCard } from './ResourceCard';
import { AnimatePresence, motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';

interface FilterableResourceListProps {
  resources: Resource[];
}

type GroupedResources = {
  [key in ResourceCategory]?: Resource[];
};

export function FilterableResourceList({ resources }: FilterableResourceListProps) {
  const [selectedCategory, setSelectedCategory] = useState<ResourceCategory | 'All'>('All');

  const groupedAndFilteredResources = useMemo(() => {
    const filtered = selectedCategory === 'All'
      ? resources
      : resources.filter(r => r.category === selectedCategory);

    return filtered.reduce((acc, resource) => {
      const category = resource.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category]!.push(resource);
      return acc;
    }, {} as GroupedResources);
  }, [resources, selectedCategory]);

  const categoriesToDisplay = (selectedCategory === 'All'
    ? resourceCategories
    : [selectedCategory]
  ).filter(cat => groupedAndFilteredResources[cat] && groupedAndFilteredResources[cat]!.length > 0);

  return (
    <div className="space-y-8 bg-background">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedCategory === 'All' ? 'default' : 'outline'}
          onClick={() => setSelectedCategory('All')}
          className="rounded-full"
        >
          All
        </Button>
        {resourceCategories.map(cat => (
          <Button
            key={cat}
            variant={selectedCategory === cat ? 'default' : 'outline'}
            onClick={() => setSelectedCategory(cat)}
            className="rounded-full"
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Resources Accordion */}
      <AnimatePresence>
        <motion.div
          key={selectedCategory}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {categoriesToDisplay.length > 0 ? (
            <Accordion type="multiple" defaultValue={categoriesToDisplay} className="w-full space-y-4">
              {categoriesToDisplay.map(category => (
                <AccordionItem key={category} value={category} className="border-b-0 rounded-lg overflow-hidden border">
                  <AccordionTrigger className="text-xl font-headline hover:no-underline bg-muted dark:bg-card px-6 py-4 data-[state=open]:border-b">
                    <div className="flex items-center gap-3">
                      {category}
                      <Badge variant="secondary">{groupedAndFilteredResources[category]?.length}</Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="bg-muted dark:bg-background px-6 pb-6">
                    <div className="pt-4 grid gap-4 md:grid-cols-2">
                      {groupedAndFilteredResources[category]?.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          ) : (
            <div className="text-center py-16 text-muted-foreground border-2 border-dashed rounded-lg">
              <p className="font-semibold text-lg">No resources found</p>
              <p className="text-sm mt-1">There are no resources in this category yet.</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
