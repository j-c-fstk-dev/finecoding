'use server';

import { db } from '@/lib/firebase';
import { z } from 'zod';
import { Resend } from 'resend';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const SubscribeSchema = z.object({
  email: z.string().email(),
});

async function syncWithBeehiiv(email: string) {
  const apiKey = process.env.BEEHIIV_API_KEY;
  const publicationId = process.env.BEEHIIV_PUBLICATION_ID;

  if (!apiKey || !publicationId) {
    console.warn('Beehiiv API Key or Publication ID not set. Skipping sync.');
    return;
  }

  try {
    const response = await fetch(`https://api.beehiiv.com/v2/publications/${publicationId}/subscriptions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        email: email,
        send_welcome_email: true, // Automatically sends Beehiiv's welcome email
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Failed to sync subscriber to Beehiiv:', errorData);
      // We don't throw an error, as the main goal (saving to Firestore) succeeded.
    } else {
      console.log(`Successfully synced subscriber ${email} to Beehiiv.`);
    }
  } catch (error) {
    console.error('Error calling Beehiiv API:', error);
  }
}

export async function subscribeToNewsletter(email: string): Promise<{ success: boolean; error?: string }> {
  const validationResult = SubscribeSchema.safeParse({ email });

  if (!validationResult.success) {
    return { success: false, error: 'Invalid email address.' };
  }

  try {
    const newsletterCollection = collection(db, 'subscribers');

    const q = query(newsletterCollection, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { success: false, error: 'This email is already subscribed.' };
    }

    // Save to Firestore first, as it's our primary source of truth
    await addDoc(newsletterCollection, {
      email: email,
      subscribedAt: serverTimestamp(),
    });

    // Perform side-effects: sync to Beehiiv and send admin notification
    // We run them in parallel to not slow down the user's request.
    await Promise.all([
      syncWithBeehiiv(email),
      (async () => {
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
      })()
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return { success: false, error: 'An unexpected error occurred. Please try again later.' };
  }
}

export async function getSubscribersAsCsv(): Promise<string | null> {
  try {
    const subscribersCollection = collection(db, 'subscribers');
    const q = query(subscribersCollection, orderBy('subscribedAt', 'desc'));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return null;
    }

    const headers = ['email', 'subscribedAt'];
    const rows = querySnapshot.docs.map(doc => {
      const data = doc.data();
      const email = data.email || '';
      const subscribedAt = data.subscribedAt ? (data.subscribedAt as Timestamp).toDate().toISOString() : '';
      return `"${email}","${subscribedAt}"`;
    });

    return [headers.join(','), ...rows].join('\n');
  } catch (error) {
    console.error("Error exporting subscribers to CSV:", error);
    throw new Error("Failed to export subscribers.");
  }
}
