'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Heart, MessageSquare, Loader2, User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

import type { Post, Comment } from '@/types';
import { likePost } from '@/lib/posts';
import { addComment } from '@/lib/comments';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { PostNavigation } from '@/components/blog/PostNavigation';
import { ShareOnXButton } from './ShareButtons';

interface PostInteractionProps {
  post: Post;
  initialComments: Comment[];
  previousPost: Post | null;
  nextPost: Post | null;
}

const commentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50),
  comment: z.string().min(3, { message: 'Comment must be at least 3 characters.' }).max(1000),
});

export function PostInteraction({ post, initialComments, previousPost, nextPost }: PostInteractionProps) {
  const router = useRouter();
  const { toast } = useToast();
  
  const [likes, setLikes] = useState(post.likes || 0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      setIsLiked(likedPosts.includes(post.id));
    }
  }, [post.id]);

  const handleLike = async () => {
    if (isLiked || isLiking || !post.id) return;

    setIsLiking(true);
    setLikes(prev => prev + 1);
    setIsLiked(true);

    try {
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]');
      localStorage.setItem('likedPosts', JSON.stringify([...likedPosts, post.id]));
      
      await likePost(post.id, post.slug);
    } catch (error) {
      console.error('Failed to like post:', error);
      setLikes(prev => prev - 1);
      setIsLiked(false);
      toast({
        title: 'Error',
        description: 'Could not like the post. Please try again.',
        variant: 'destructive',
      });
      const likedPosts = JSON.parse(localStorage.getItem('likedPosts') || '[]').filter((id: string) => id !== post.id);
      localStorage.setItem('likedPosts', JSON.stringify(likedPosts));
    } finally {
        setIsLiking(false);
    }
  };

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { name: '', comment: '' },
  });

  const { isSubmitting } = form.formState;

  const onCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!post.id) return;
    try {
      await addComment(post.id, post.slug, values);
      toast({ title: 'Comment Submitted!', description: 'Thank you for your feedback.' });
      form.reset();
      router.refresh();
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast({
        title: 'Error',
        description: 'Could not submit your comment. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="mt-16 space-y-12">
      <Separator />
      
      <div className="flex items-center justify-center gap-4">
        <Button onClick={handleLike} disabled={isLiked || isLiking} variant="outline" size="lg" className="group rounded-full px-6 py-3 text-lg transition-transform hover:scale-105">
          <Heart className={cn("mr-2 h-6 w-6 transition-colors", isLiked ? 'text-red-500 fill-current' : 'group-hover:text-red-500')} />
          {isLiking ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          <span className="font-semibold">{likes}</span>
        </Button>
        <ShareOnXButton title={post.title} slug={post.slug} />
      </div>
      
      <PostNavigation previousPost={previousPost} nextPost={nextPost} />

      <div className="space-y-8">
        <h2 className="font-headline text-2xl font-bold tracking-tight md:text-3xl">
          <MessageSquare className="inline-block h-7 w-7 mr-2 -mt-1" />
          Leave a Comment
        </h2>
        
        <Card>
          <CardContent className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onCommentSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Comment</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Share your thoughts..." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Post Comment
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        <div className="space-y-8">
            <h3 className="font-headline text-xl font-bold">
                {initialComments.length} {initialComments.length === 1 ? 'Comment' : 'Comments'}
            </h3>
            {initialComments.length > 0 ? (
                initialComments.map((comment) => (
                    <div key={comment.id} className="flex items-start space-x-4">
                        <Avatar className="border">
                            <AvatarFallback>
                                <User className="h-5 w-5 text-muted-foreground" />
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-baseline justify-between">
                                <p className="font-semibold text-card-foreground">{comment.name}</p>
                                <p className="text-xs text-muted-foreground">
                                    {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                                </p>
                            </div>
                            <p className="mt-2 text-muted-foreground prose dark:prose-invert max-w-none">{comment.comment}</p>
                        </div>
                    </div>
                ))
            ) : (
                <div className="text-center py-8 text-muted-foreground border-2 border-dashed rounded-lg">
                    <p>No comments yet.</p>
                    <p className="text-sm mt-1">Be the first one to share your thoughts!</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
