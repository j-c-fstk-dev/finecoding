"use client";

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Mail } from 'lucide-react';

export function EmailSignup() {
  const [email, setEmail] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      console.log('Email submitted:', email);
      toast({
        title: 'Subscription successful!',
        description: `Thanks for subscribing, ${email}.`,
      });
      setEmail('');
    } else {
      toast({
        title: 'Error',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 shadow-md">
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
        />
        <Button type="submit">
          <Mail className="mr-2 h-4 w-4" />
          Subscribe
        </Button>
      </form>
    </div>
  );
}
