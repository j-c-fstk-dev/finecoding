'use server';

import { db } from '@/lib/firebase';
import { z } from 'zod';
import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(email: string) {
  if (!db) {
    console.warn('Firebase is not initialized. Newsletter subscription is disabled during build.');
    return { error: 'Service is temporarily unavailable.' };
  }
  
  const result = SubscribeSchema.safeParse({ email });

  if (!result.success) {
    return { error: 'Invalid email address.' };
  }

  try {
    const { collection, addDoc, serverTimestamp, query, where, getDocs } = await import('firebase/firestore');

    const newsletterCollection = collection(db, 'subscribers');

    const q = query(newsletterCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'This email is already subscribed.' };
    }

    await addDoc(newsletterCollection, {
      email: email,
      subscribedAt: serverTimestamp(),
    });

    if (resend) {
      const adminEmail = process.env.ADMIN_EMAIL;
      if (adminEmail) {
        try {
          await resend.emails.send({
            from: 'Matrix Coder <onboarding@resend.dev>',
            to: adminEmail,
            subject: 'New Newsletter Subscriber!',
            html: `<p>A new user has subscribed to your newsletter:</p><p><strong>${email}</strong></p>`,
          });
        } catch (emailError) {
          console.error('Failed to send notification email:', emailError);
        }
      } else {
        console.warn('ADMIN_EMAIL environment variable not set. Skipping notification.');
      }
    } else {
        console.warn('RESEND_API_KEY not found. Skipping email notification.');
    }

    return { success: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
