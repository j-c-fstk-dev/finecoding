import Link from 'next/link';
import Image from 'next/image';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Post } from '@/types';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <div className="card-glow group">
      <div className="card-content-wrapper border-2 border-transparent group-hover:border-primary transition-all duration-300 ease-in-out">
        <div className="overflow-hidden rounded-t-[calc(var(--radius)-4px)]">
          <Link href={`/posts/${post.slug}`}>
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={600}
              height={400}
              className="w-full object-cover aspect-video transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={post.imageHint}
            />
          </Link>
        </div>
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
      </div>
    </div>
  );
}
