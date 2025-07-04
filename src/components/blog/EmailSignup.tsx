"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail, Loader2 } from 'lucide-react';
import { subscribeToNewsletter } from '@/lib/newsletter';

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast({
        title: 'Error',
        description: 'Please enter an email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    const result = await subscribeToNewsletter(email);
    setIsLoading(false);

    if (result?.success) {
      toast({
        title: 'Subscription successful!',
        description: `Thanks for subscribing, ${email}.`,
      });
      setEmail('');
    } else {
      toast({
        title: 'Subscription Failed',
        description: result?.error || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-lg">
      <h3 className="font-headline text-lg font-semibold text-card-foreground">Stay Updated</h3>
      <p className="mt-2 text-sm text-muted-foreground">
        Get the latest posts, tutorials, and insights delivered to your inbox.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex w-full max-w-md flex-col gap-2 sm:flex-row">
        <Input
          type="email"
          placeholder="hacker@matrix.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
          Subscribe
        </Button>
      </form>
    </div>
  );
}
