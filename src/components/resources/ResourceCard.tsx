import type { Resource } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';
import { DynamicIcon } from '@/components/icons';
import type { IconName } from '@/components/icons';
import { ResourceCardActions } from './ResourceCardActions';

export function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="bg-muted/25 p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-background flex-shrink-0 border">
              <DynamicIcon name={resource.icon as IconName} className="h-6 w-6 text-primary" />
            </div>
            <div>
                <CardTitle className="text-base font-semibold leading-tight">
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded-sm">
                        {resource.name}
                    </a>
                </CardTitle>
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
      <CardContent className="flex-grow p-4">
        <CardDescription className="text-sm">{resource.description}</CardDescription>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <ResourceCardActions resource={resource} />
      </CardFooter>
    </Card>
  );
}
