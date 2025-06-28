'use server';

import { db } from '@/lib/firebase';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(email: string) {
  // Gracefully handle builds without Firebase credentials.
  if (!db) {
    console.warn('Firebase is not initialized. Newsletter subscription is disabled during build.');
    // In a real scenario for a static build, you might just do nothing.
    // Here we return an error to be consistent with the live environment behavior.
    return { error: 'Service is temporarily unavailable.' };
  }
  
  const result = SubscribeSchema.safeParse({ email });

  if (!result.success) {
    return { error: 'Invalid email address.' };
  }

  try {
    // Dynamically import firestore functions only when needed.
    // This prevents the SDK from being initialized during the static build process.
    const { collection, addDoc, serverTimestamp, query, where, getDocs } = await import('firebase/firestore');

    const newsletterCollection = collection(db, 'subscribers');

    // Check if email already exists
    const q = query(newsletterCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { error: 'This email is already subscribed.' };
    }

    await addDoc(newsletterCollection, {
      email: email,
      subscribedAt: serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { error: 'An unexpected error occurred. Please try again later.' };
  }
}
