'use server';

import { db } from '@/lib/firebase';
import { z } from 'zod';
import { Resend } from 'resend';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const WishlistSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters.').max(100, 'Tool name is too long.'),
});

export async function addToWishlist(toolName: string): Promise<{ success: boolean; error?: string }> {
  const result = WishlistSchema.safeParse({ toolName });

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    if (db) {
      const wishlistCollection = collection(db, 'wishlist');
      await addDoc(wishlistCollection, {
        name: toolName,
        requestedAt: serverTimestamp(),
      });
    }

    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        await resend.emails.send({
          from: 'Fine Coding Wishlist <onboarding@resend.dev>',
          to: adminEmail,
          subject: 'New Wishlist Request!',
          html: `<p>A new tool has been requested for the Resource Hub:</p><p><strong>${toolName}</strong></p>`,
        });
      }
    } else {
        console.warn('RESEND_API_KEY not found. Skipping email notification for wishlist.');
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}
