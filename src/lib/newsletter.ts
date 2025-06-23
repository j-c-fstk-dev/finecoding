'use server';

import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { z } from 'zod';

const SubscribeSchema = z.object({
  email: z.string().email(),
});

export async function subscribeToNewsletter(email: string) {
  const result = SubscribeSchema.safeParse({ email });

  if (!result.success) {
    return { error: 'Invalid email address.' };
  }

  try {
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
