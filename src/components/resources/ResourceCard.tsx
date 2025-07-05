import type { Resource } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { DynamicIcon } from '@/components/icons';
import type { IconName } from '@/components/icons';
import { ResourceCardActions } from './ResourceCardActions';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="w-full max-w-sm h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <a
        href={resource.link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Visit ${resource.name}`}
        className="block rounded-t-lg bg-secondary p-4 border-b-4 border-border transition-all duration-150 ease-out hover:bg-muted/70 active:translate-y-1 active:border-b-0"
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background flex-shrink-0 border">
              <DynamicIcon name={resource.icon as IconName} className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="text-base font-semibold leading-tight text-card-foreground">
                {resource.name}
              </h3>
              <Badge variant="outline" className="mt-2 font-mono text-xs">{resource.pricing}</Badge>
            </div>
          </div>
          <ExternalLink className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </a>
      <CardContent className="flex-grow p-4">
        <CardDescription className="text-sm">{resource.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <ResourceCardActions resource={resource} />
      </CardFooter>
    </Card>
  );
}
