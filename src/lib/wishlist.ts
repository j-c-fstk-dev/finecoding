'use server';

import { db } from '@/lib/firebase';
import { z } from 'zod';
import { Resend } from 'resend';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;
const adminEmail = process.env.ADMIN_EMAIL;

const WishlistSchema = z.object({
  toolName: z.string().min(2, 'Tool name must be at least 2 characters.').max(100, 'Tool name is too long.'),
});

export async function addToWishlist(toolName: string): Promise<{ success: boolean; error?: string }> {
  const result = WishlistSchema.safeParse({ toolName });

  if (!result.success) {
    return { success: false, error: result.error.errors[0].message };
  }

  try {
    // First, try to save to DB. This is the most critical part.
    if (db) {
      const wishlistCollection = collection(db, 'wishlist');
      await addDoc(wishlistCollection, {
        name: toolName,
        requestedAt: serverTimestamp(),
      });
    } else {
      console.warn('Firestore is not initialized. Wishlist item will not be saved to the database.');
    }

    // Now, attempt to send the email notification. This is a secondary action.
    if (!resend) {
        console.warn('RESEND_API_KEY is not set. Skipping wishlist email notification.');
    } else if (!adminEmail) {
        console.warn('ADMIN_EMAIL is not set. Skipping wishlist email notification.');
    } else {
      try {
        await resend.emails.send({
          from: 'Fine Coding Wishlist <onboarding@resend.dev>',
          to: adminEmail,
          subject: 'New Wishlist Request!',
          html: `<p>A new tool has been requested for the Resource Hub:</p><p><strong>${toolName}</strong></p>`,
        });
        console.log(`Wishlist notification sent successfully to ${adminEmail}`);
      } catch (emailError) {
        console.error('Failed to send wishlist notification email:', emailError);
        // We don't want to fail the whole operation if only the email fails.
        // The request is already in the database, which is the most important part.
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return { success: false, error: 'An unexpected error occurred while saving the request. Please try again later.' };
  }
}
