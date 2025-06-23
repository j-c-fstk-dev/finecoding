import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types';
import { Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex h-full flex-col overflow-hidden border-2 border-transparent transition-all duration-300 ease-in-out hover:border-primary hover:shadow-lg hover:shadow-primary/20">
      <CardHeader>
        <CardTitle className="font-headline text-xl leading-tight">
          <Link href={`/posts/${post.slug}`} className="hover:text-primary transition-colors">
            {post.title}
          </Link>
        </CardTitle>
        <CardDescription className="flex items-center gap-2 pt-2 text-xs">
          <Calendar className="h-4 w-4" />
          <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{post.excerpt}</p>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
         {post.tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="font-code">
            # {tag}
          </Badge>
        ))}
      </CardFooter>
    </Card>
  );
}
