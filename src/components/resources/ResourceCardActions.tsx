"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { formatDistanceToNow } from 'date-fns';
import { Star, MessageSquare, Loader2, User, Send } from 'lucide-react';

import type { Resource, ResourceComment } from '@/types';
import { likeResource } from '@/lib/resources';
import { addResourceComment, getResourceComments } from '@/lib/comments';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const commentSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }).max(50),
  comment: z.string().min(3, { message: 'Comment must be at least 3 characters.' }).max(1000),
});

export function ResourceCardActions({ resource }: { resource: Resource }) {
  const { toast } = useToast();
  
  const [favorites, setFavorites] = useState(resource.favorites || 0);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isFavoriting, setIsFavoriting] = useState(false);
  
  const [comments, setComments] = useState<ResourceComment[]>([]);
  const [commentCount, setCommentCount] = useState(0); // For optimistic update
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [areCommentsLoading, setAreCommentsLoading] = useState(false);
  const [hasLoadedComments, setHasLoadedComments] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined' && resource.id) {
      const favoritedResources = JSON.parse(localStorage.getItem('favoritedResources') || '[]');
      setIsFavorited(favoritedResources.includes(resource.id));
    }
  }, [resource.id]);

  useEffect(() => {
    async function fetchComments() {
      if (isCommentsOpen && !hasLoadedComments && resource.id) {
        setAreCommentsLoading(true);
        try {
          const fetchedComments = await getResourceComments(resource.id);
          setComments(fetchedComments);
          setCommentCount(fetchedComments.length);
        } catch (error) {
          console.error("Failed to fetch comments:", error);
          toast({ title: "Error", description: "Could not load comments.", variant: "destructive" });
        } finally {
          setAreCommentsLoading(false);
          setHasLoadedComments(true);
        }
      }
    }
    fetchComments();
  }, [isCommentsOpen, hasLoadedComments, resource.id, toast]);

  const handleFavorite = async () => {
    if (isFavorited || isFavoriting || !resource.id) return;

    setIsFavoriting(true);
    setFavorites(prev => prev + 1);
    setIsFavorited(true);

    try {
      const favoritedResources = JSON.parse(localStorage.getItem('favoritedResources') || '[]');
      localStorage.setItem('favoritedResources', JSON.stringify([...favoritedResources, resource.id]));
      await likeResource(resource.id);
    } catch (error) {
      console.error('Failed to favorite resource:', error);
      setFavorites(prev => prev - 1);
      setIsFavorited(false);
      toast({ title: "Error", description: "Could not favorite the resource.", variant: "destructive" });
      const favoritedResources = JSON.parse(localStorage.getItem('favoritedResources') || '[]').filter((id: string) => id !== resource.id);
      localStorage.setItem('favoritedResources', JSON.stringify(favoritedResources));
    } finally {
      setIsFavoriting(false);
    }
  };

  const form = useForm<z.infer<typeof commentSchema>>({
    resolver: zodResolver(commentSchema),
    defaultValues: { name: '', comment: '' },
  });

  const onCommentSubmit = async (values: z.infer<typeof commentSchema>) => {
    if (!resource.id) return;
    try {
      await addResourceComment(resource.id, values);
      toast({ title: 'Comment Submitted!', description: 'Thank you for your feedback.' });
      form.reset();
      // Optimistically add comment to UI
      const newComment: ResourceComment = { ...values, id: Date.now().toString(), createdAt: new Date() };
      setComments(prev => [newComment, ...prev]);
      setCommentCount(prev => prev + 1);
    } catch (error) {
      console.error('Failed to submit comment:', error);
      toast({ title: "Error", description: "Could not submit your comment.", variant: "destructive" });
    }
  };

  return (
    <Collapsible open={isCommentsOpen} onOpenChange={setIsCommentsOpen} className="w-full space-y-4">
      <div className="flex w-full items-center justify-end space-x-4">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleFavorite} disabled={isFavorited || isFavoriting}>
            <Star className={cn("h-5 w-5", isFavorited ? 'text-yellow-400 fill-current' : 'hover:text-yellow-400')} />
          </Button>
          <span className="text-sm font-medium">{favorites}</span>
        </div>
        <div className="flex items-center gap-2 text-muted-foreground">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MessageSquare className="h-5 w-5" />
            </Button>
          </CollapsibleTrigger>
          <span className="text-sm font-medium">{commentCount}</span>
        </div>
      </div>

      <CollapsibleContent className="space-y-6 pt-4">
        <Separator />
        
        {/* Comment Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onCommentSubmit)} className="space-y-4">
            <FormField control={form.control} name="name" render={({ field }) => (
              <FormItem><FormLabel>Your Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <FormField control={form.control} name="comment" render={({ field }) => (
              <FormItem><FormLabel>Your Comment</FormLabel><FormControl><Textarea placeholder="Share your thoughts..." {...field} /></FormControl><FormMessage /></FormItem>
            )}/>
            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />} Post
            </Button>
          </form>
        </Form>
        
        {/* Comment List */}
        <div className="space-y-6">
          <h4 className="text-sm font-semibold text-muted-foreground">Comments</h4>
          {areCommentsLoading ? (
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="flex items-start space-x-3">
                <Avatar className="h-8 w-8 border"><AvatarFallback><User className="h-4 w-4 text-muted-foreground" /></AvatarFallback></Avatar>
                <div className="flex-1 text-sm">
                  <div className="flex items-baseline justify-between"><p className="font-semibold text-card-foreground">{comment.name}</p><p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}</p></div>
                  <p className="mt-1 text-muted-foreground">{comment.comment}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-muted-foreground py-4">No comments yet. Be the first!</p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
