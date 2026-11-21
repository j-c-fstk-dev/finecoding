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
    <form onSubmit={handleSubmit} className="mx-auto flex w-full max-w-md flex-col gap-2 sm:flex-row">
      <Input
        type="email"
        placeholder="you@domain.dev"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        disabled={isLoading}
        aria-label="Email address"
        className="h-11 flex-1 rounded-full border-input bg-card px-5 font-mono text-[13px]"
      />
      <Button type="submit" disabled={isLoading} className="h-11 rounded-full bg-foreground px-6 text-background hover:bg-foreground/85">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
        Subscribe
      </Button>
    </form>
  );
}
