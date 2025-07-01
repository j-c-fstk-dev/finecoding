"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Resource } from "@/types";
import { resourceCategories, pricingModels } from "@/types";
import { addResource, updateResource } from "@/lib/resources";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }).max(300, { message: "Description must be 300 characters or less." }),
  link: z.string().url({ message: "Please enter a valid URL." }),
  category: z.enum(resourceCategories),
  pricing: z.enum(pricingModels),
  icon: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ResourceEditorFormProps {
  resource?: Resource;
}

export function ResourceEditorForm({ resource }: ResourceEditorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: resource?.name || "",
      description: resource?.description || "",
      link: resource?.link || "",
      category: resource?.category || resourceCategories[0],
      pricing: resource?.pricing || pricingModels[0],
      icon: resource?.icon || "",
    },
  });

  async function onSubmit(values: FormData) {
    setIsSubmitting(true);
    try {
      if (resource && resource.id) {
        await updateResource(resource.id, values);
        toast({
          title: "Resource Updated!",
          description: `"${values.name}" has been saved.`,
        });
      } else {
        await addResource(values);
        toast({
          title: "Resource Created!",
          description: `"${values.name}" has been added.`,
        });
      }
      router.push('/dashboard/resources');
      router.refresh();
    } catch (error: any) {
      console.error("Failed to save resource:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Could not save the resource. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resource Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Google Gemini" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of what this resource is or does." className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="https://example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {resourceCategories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pricing"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pricing Model</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a pricing model" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {pricingModels.map(price => (
                      <SelectItem key={price} value={price}>{price}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {resource ? "Update Resource" : "Create Resource"}
        </Button>
      </form>
    </Form>
  );
}
