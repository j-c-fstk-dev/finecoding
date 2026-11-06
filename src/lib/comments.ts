'use server';

import { adminDb } from '@/lib/firebase-admin';
import type { Comment, ResourceComment } from '@/types';
import { FieldValue, Timestamp } from 'firebase-admin/firestore';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const CommentSchema = z.object({
  name: z.string().trim().min(2).max(50),
  comment: z.string().trim().min(3).max(1000),
});

function toDate(value: unknown): Date {
  if (value instanceof Timestamp) return value.toDate();
  if (value instanceof Date) return value;
  return new Date();
}

async function readComments(collectionPath: string): Promise<Comment[]> {
  try {
    const snapshot = await adminDb().collection(collectionPath).orderBy('createdAt', 'desc').get();
    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name,
        comment: data.comment,
        createdAt: toDate(data.createdAt),
      };
    });
  } catch (error) {
    // Comments are secondary content: never break the page because of them.
    console.error(`Error fetching comments from ${collectionPath}:`, error);
    return [];
  }
}

// --- Post Comments ---

export async function getComments(postId: string): Promise<Comment[]> {
  return readComments(`posts/${postId}/comments`);
}

export async function addComment(postId: string, slug: string, commentData: { name: string; comment: string }) {
  const data = CommentSchema.parse(commentData);
  const postRef = adminDb().collection('posts').doc(postId);
  if (!(await postRef.get()).exists) throw new Error('Post not found.');

  await postRef.collection('comments').add({
    ...data,
    createdAt: FieldValue.serverTimestamp(),
  });
  revalidatePath(`/posts/${slug}`);
}

// --- Resource Comments ---

export async function getResourceComments(resourceId: string): Promise<ResourceComment[]> {
  return readComments(`resources/${resourceId}/comments`);
}

export async function addResourceComment(resourceId: string, commentData: { name: string; comment: string }) {
  const data = CommentSchema.parse(commentData);
  // Built-in (hardcoded) resources have no Firestore document, but a comments
  // subcollection can still live under their id, so we don't require the parent to exist.
  await adminDb()
    .collection('resources')
    .doc(resourceId)
    .collection('comments')
    .add({
      ...data,
      createdAt: FieldValue.serverTimestamp(),
    });
  revalidatePath('/resources');
}
