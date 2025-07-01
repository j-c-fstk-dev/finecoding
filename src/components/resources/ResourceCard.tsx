import type { Resource } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { DynamicIcon } from '@/components/icons';
import type { IconName } from '@/components/icons';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted flex-shrink-0">
              <DynamicIcon name={resource.icon as IconName} className="h-6 w-6 text-muted-foreground" />
            </div>
            <div>
              <CardTitle className="text-base font-semibold leading-tight">{resource.name}</CardTitle>
              <Badge variant="outline" className="mt-2 font-mono text-xs">{resource.pricing}</Badge>
            </div>
          </div>
          <a
            href={resource.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Visit ${resource.name}`}
            className="text-muted-foreground hover:text-primary transition-colors flex-shrink-0 p-1"
          >
            <ExternalLink className="h-5 w-5" />
          </a>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-sm">{resource.description}</CardDescription>
      </CardContent>
    </Card>
  );
}
