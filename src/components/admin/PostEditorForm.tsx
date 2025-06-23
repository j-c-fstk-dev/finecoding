"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2, Wand2 } from "lucide-react";
import { suggestTags } from "@/ai/flows/suggest-tags";
import type { Post } from "@/types";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }),
  content: z.string().min(50, { message: "Content must be at least 50 characters." }),
  tags: z.array(z.string()).min(1, { message: "At least one tag is required." }),
});

type FormData = z.infer<typeof formSchema>;

interface PostEditorFormProps {
  post?: Post;
}

export function PostEditorForm({ post }: PostEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [currentTagInput, setCurrentTagInput] = useState('');
  const { toast } = useToast();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: post?.title || "",
      content: post?.content || "",
      tags: post?.tags || [],
    },
  });
  
  const tags = form.watch("tags");

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && currentTagInput.trim()) {
      e.preventDefault();
      const newTags = [...tags, currentTagInput.trim()];
      form.setValue('tags', newTags, { shouldValidate: true });
      setCurrentTagInput('');
    }
  }

  function removeTag(tagToRemove: string) {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    form.setValue('tags', newTags, { shouldValidate: true });
  }

  async function handleSuggestTags() {
    setIsSuggesting(true);
    const content = form.getValues("content");
    if (content.length < 50) {
      toast({
        title: "Content too short",
        description: "Please write more content before suggesting tags.",
        variant: "destructive",
      });
      setIsSuggesting(false);
      return;
    }
    try {
      const result = await suggestTags({ postContent: content });
      const newTags = [...new Set([...tags, ...result.tags])];
      form.setValue("tags", newTags, { shouldValidate: true });
      toast({ title: "Tags suggested!", description: "AI has added new tags based on your content." });
    } catch (error) {
      console.error("Error suggesting tags:", error);
      toast({ title: "Error", description: "Could not suggest tags.", variant: "destructive" });
    } finally {
      setIsSuggesting(false);
    }
  }

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    console.log("Form submitted:", values);
    // Here you would typically call an API to save the post
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast({
      title: post ? "Post Updated!" : "Post Created!",
      description: `"${values.title}" has been saved.`,
    });
    setIsSubmitting(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="My Awesome Blog Post" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content (Markdown)</FormLabel>
              <FormControl>
                <Textarea placeholder="Write your masterpiece here..." className="min-h-[400px] font-code" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="tags"
          render={() => (
             <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="flex items-center gap-2">
                <FormControl>
                    <Input
                        placeholder="Add a tag and press Enter"
                        value={currentTagInput}
                        onChange={(e) => setCurrentTagInput(e.target.value)}
                        onKeyDown={handleTagKeyDown}
                    />
                </FormControl>
                <Button type="button" variant="outline" onClick={handleSuggestTags} disabled={isSuggesting}>
                  {isSuggesting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                  Suggest
                </Button>
              </div>
              <FormDescription>Press Enter to add a tag. Click a tag to remove it.</FormDescription>
              <div className="flex flex-wrap gap-2 pt-2">
                {tags.map(tag => (
                  <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
                    {tag} &times;
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {post ? "Update Post" : "Create Post"}
        </Button>
      </form>
    </Form>
  );
}
